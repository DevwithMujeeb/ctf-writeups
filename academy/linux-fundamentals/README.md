# Linux Fundamentals — HackTheBox Academy

**Module:** Linux Fundamentals
**Platform:** HackTheBox Academy
**Status:** 🟡 In progress

---

## Overview

Linux Fundamentals covers the core concepts needed to navigate, manage, and understand Linux systems — the foundation for everything in offensive and defensive security. Most CTF machines and real-world targets run Linux, so fluency here is non-negotiable.

---

## File System Navigation

```bash
ls -la          # list all files including hidden, with permissions and metadata
cd /path        # change directory
pwd             # print working directory
find / -name "filename" 2>/dev/null   # search filesystem, suppress permission errors
```

**Key concepts:**

- Everything in Linux is a file — devices, sockets, pipes
- Hidden files start with a `.` (dot)
- `-la` flags: `-l` for long format (permissions, owner, size), `-a` for all including hidden

---

## File Permissions

| Position | Meaning                                          |
| -------- | ------------------------------------------------ |
| `-`      | File type (`-` file, `d` directory, `l` symlink) |
| `rwx`    | Owner permissions (read, write, execute)         |
| `r-x`    | Group permissions                                |
| `r--`    | Other permissions                                |

**Changing permissions:**

```bash
chmod 755 file      # owner: rwx, group: r-x, other: r-x
chmod +x file       # add execute for all
chown user:group file  # change owner and group
```

---

## Process and Service Management

```bash
ps aux              # list all running processes
ss -tln             # list all listening TCP sockets (ports)
systemctl status <service>   # check service status
systemctl list-units --type=service  # list all services
```

**Key concepts:**

- `ss -tln` is the modern replacement for `netstat -tlnp`
- Services running locally (127.0.0.1) won't show in external scans — always check internally
- `systemctl` manages systemd services — the init system on most modern Linux distros

---

## File Search and Discovery

```bash
find / -type f -name "*.conf" 2>/dev/null     # find all config files
find / -perm -4000 2>/dev/null                # find SUID binaries (privesc vector)
find / -writable -type f 2>/dev/null          # find writable files
grep -r "password" /etc/ 2>/dev/null          # search for strings recursively
```

**Why this matters for CTF/pentest:**

- Config files often contain credentials
- SUID binaries are a common privilege escalation vector
- Writable files in sensitive locations can be abused

---

## User and Group Management

```bash
whoami              # current user
id                  # current user + group memberships
cat /etc/passwd     # list all users
cat /etc/group      # list all groups
sudo -l             # list what current user can run as sudo
```

**Key concepts:**

- `/etc/passwd` shows all users — look for non-standard users during enumeration
- `sudo -l` is one of the first things to run after gaining a foothold

---

## Networking Basics

```bash
ip a                # show all network interfaces and IPs
ip route            # show routing table
ss -tln             # listening ports
curl http://localhost:<port>   # test locally running services
```

---

## Key Takeaways So Far

- Linux file permissions and ownership are fundamental — misconfigurations here are a major attack surface
- SUID binaries, writable files, and sudo permissions are the first things to check during privilege escalation
- Services listening only on localhost won't be visible from outside — always enumerate internally after foothold
- `find` with `2>/dev/null` is essential to suppress noise from permission-denied errors

---

## Resources

- [HackTheBox Academy — Linux Fundamentals](https://academy.hackthebox.com/module/details/18)
- [GTFOBins](https://gtfobins.github.io) — SUID/sudo binary abuse reference
- [Linux Privilege Escalation Guide](https://book.hacktricks.xyz/linux-hardening/privilege-escalation)
