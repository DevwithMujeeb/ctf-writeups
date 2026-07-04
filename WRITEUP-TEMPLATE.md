# [Machine Name] — HackTheBox

**Difficulty:** Easy / Medium / Hard
**OS:** Linux / Windows
**Date Completed:** YYYY-MM-DD
**Status:** Retired ✅

---

## Summary

One paragraph describing the machine at a high level — what made it interesting, what the core vulnerability or path was, and what skill it tested. Write this last, after completing the writeup.

---

## Reconnaissance

### Nmap scan

```bash
nmap -sC -sV -oN nmap/initial <target-ip>
```

**Open ports:**

| Port | Service | Version     |
| ---- | ------- | ----------- |
| 22   | SSH     | OpenSSH x.x |
| 80   | HTTP    | Apache x.x  |

**Notable findings:**

- Note anything interesting from service banners, scripts, or version info

---

## Enumeration

### Web enumeration (if applicable)

```bash
gobuster dir -u http://<target-ip> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

**Findings:**

- Document discovered directories, files, or endpoints worth investigating

### Service-specific enumeration

Document any service-specific enumeration steps taken (SMB, FTP, SNMP, etc.) and what they revealed.

---

## Foothold

Describe how initial access was gained. Include:

- The vulnerability or misconfiguration exploited
- Any tools or exploits used
- The exact commands that achieved the foothold

```bash
# Example command
```

**User flag:** `HTB{...}` ← only include after machine is retired

---

## Privilege Escalation

Document the path from initial access to root/administrator. Include:

- What enumeration revealed the privesc vector
- The exact steps taken

```bash
# Example command
```

**Root flag:** `HTB{...}` ← only include after machine is retired

---

## Key Takeaways

- What was the core vulnerability or concept this machine demonstrated?
- What tools or techniques were used for the first time?
- What would you do differently next time?
- Any rabbit holes that wasted time and why?

---

## Tools Used

| Tool     | Purpose                               |
| -------- | ------------------------------------- |
| nmap     | Port scanning and service enumeration |
| gobuster | Directory brute-forcing               |
|          |                                       |

---

## References

- [Link to relevant CVE, exploit, or resource]
- [Link to tool documentation]
