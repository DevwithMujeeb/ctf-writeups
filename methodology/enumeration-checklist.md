# Enumeration Checklist

A reusable checklist for approaching any new HackTheBox machine. Built up progressively as patterns emerge across machines.

---

## Phase 1: External Reconnaissance

```bash
# Full port scan
nmap -p- --min-rate 5000 -oN nmap/full <target-ip>

# Service and script scan on discovered ports
nmap -sC -sV -p <ports> -oN nmap/targeted <target-ip>

# UDP scan (top 100)
nmap -sU --top-ports 100 -oN nmap/udp <target-ip>
```

**Questions to answer:**

- What ports are open?
- What services and versions are running?
- Are any versions known to be vulnerable?
- What OS is the target running?

---

## Phase 2: Web Enumeration (if HTTP/HTTPS is open)

```bash
# Directory brute-force
gobuster dir -u http://<target-ip> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -o gobuster/initial.txt

# Virtual host enumeration
gobuster vhost -u http://<target-ip> -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# Technology fingerprinting
whatweb http://<target-ip>
```

**Questions to answer:**

- What web framework or CMS is running?
- Are there hidden directories or files?
- Are there any virtual hosts?
- What does the source code reveal?

---

## Phase 3: Service-Specific Enumeration

### SMB (445)

```bash
smbclient -L //<target-ip> -N
enum4linux -a <target-ip>
```

### FTP (21)

```bash
ftp <target-ip>        # try anonymous login
```

### SSH (22)

```bash
# Note the version — check for known vulnerabilities
# Try default credentials only if nothing else works
```

### SNMP (161 UDP)

```bash
snmpwalk -c public -v1 <target-ip>
```

---

## Phase 4: Post-Foothold Enumeration

```bash
whoami && id                          # who are we
sudo -l                               # what can we run as sudo
cat /etc/passwd                       # list users
find / -perm -4000 2>/dev/null        # SUID binaries
find / -writable -type f 2>/dev/null  # writable files
ss -tln                               # locally listening services
cat /etc/crontab                      # scheduled tasks
env                                   # environment variables
```

**Questions to answer:**

- What user are we and what groups do we belong to?
- Are there any sudo permissions?
- Are there SUID binaries on GTFOBins?
- Are there any locally running services not visible externally?
- Are there any credentials in config files or environment variables?
- Are there any cron jobs running as root?

---

## Phase 5: Privilege Escalation Vectors (in order of likelihood)

1. `sudo -l` — can we run anything as sudo?
2. SUID binaries — check GTFOBins
3. Cron jobs — writable scripts run as root?
4. Writable `/etc/passwd` — can we add a root user?
5. Capabilities — `getcap -r / 2>/dev/null`
6. Docker/LXC group membership
7. Kernel exploits — last resort, check version with `uname -a`

---

## Notes

- Always redirect nmap output to files — you'll reference it repeatedly
- Check source code of every web page — credentials and comments are common
- `2>/dev/null` suppresses permission denied noise on find commands
- When stuck, reread ALL output from the beginning — the clue is usually already there
