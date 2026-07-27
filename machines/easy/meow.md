# Meow — HackTheBox Starting Point

**Machine:** Meow
**Difficulty:** Very Easy
**OS:** Linux
**Category:** Starting Point
**Pwned:** 26 Jul 2026
**XP Earned:** 150

---

## Summary

Meow is the first Starting Point machine on HackTheBox. It introduces the fundamental penetration testing workflow — VPN connection, host discovery, port scanning, and service exploitation. The attack path is straightforward: Nmap reveals Telnet running on port 23, and the service accepts a root login with no password — a textbook default credential vulnerability.

---

## Methodology

### 1. VPN Connection

Before any interaction with HTB machines, the OpenVPN connection must be established:

```bash
sudo openvpn starting_point.ovpn
```

Confirmed connection by checking the assigned tun0 interface:

```bash
ifconfig tun0
```

### 2. Host Discovery

Confirmed the target machine was alive before scanning:

```bash
ping -c 4 <target IP>
```

Target responded — host is up.

### 3. Enumeration — Nmap Scan

Ran an initial Nmap scan to identify open ports and running services:

```bash
sudo nmap -sV -sC <target IP> -oA meow
```

**Nmap output (relevant):**

```
PORT   STATE SERVICE VERSION
23/tcp open  telnet  Linux telnetd
```

**Findings:**

- Port 23 — Telnet open
- Linux telnetd running
- No other significant services

Telnet is an unencrypted remote access protocol — a legacy predecessor to SSH. It transmits all data including credentials in cleartext. Finding Telnet open on a public-facing machine is a significant misconfiguration.

### 4. Exploitation — Default Credentials

Attempted to connect to the Telnet service:

```bash
telnet <target IP>
```

The service presented a login prompt. Attempted `root` as the username with no password:

```
Meow login: root
```

**Access granted — root shell obtained immediately.**

No password was required. This is a default credential vulnerability — the service was left configured with an unauthenticated root login, a critical misconfiguration.

### 5. Flag

Navigated to the root home directory and retrieved the flag:

```bash
ls
cat flag.txt
```

**Flag:** `b40abdfe23665f766f9c61ecba8a4c19`

---

## Vulnerability Summary

| Vulnerability              | Severity | Description                                                                                     |
| -------------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| Telnet enabled             | High     | Unencrypted remote access protocol — all traffic including credentials transmitted in cleartext |
| Unauthenticated root login | Critical | Root account accessible with no password — complete system compromise with zero effort          |

---

## Key Lessons

- **Always check for Telnet (port 23)** — it appears regularly on older or misconfigured systems and almost always indicates weak or default credentials
- **Default credentials are real** — root with no password is not contrived; it appears in production systems, IoT devices, and network equipment regularly
- **The basic workflow works** — VPN → ping → Nmap → enumerate service → attempt default credentials → root. This chain applies to dozens of real machines
- **Telnet should never be used in production** — SSH replaced it entirely. Finding Telnet open is an immediate critical finding in any security assessment

---

## Tools Used

| Tool    | Purpose                             |
| ------- | ----------------------------------- |
| OpenVPN | VPN connection to HTB network       |
| ping    | Host discovery                      |
| Nmap    | Port scanning and service detection |
| telnet  | Service exploitation                |

---

_HackTheBox Starting Point — Meow | Pwned 26 Jul 2026_
