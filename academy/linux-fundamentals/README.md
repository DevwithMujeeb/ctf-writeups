# Linux Fundamentals — HackTheBox Academy

**Module:** Linux Fundamentals
**Platform:** HackTheBox Academy
**Status:** ✅ Completed
**Sections:** 30 sections · 21 Interactive

---

## Overview

Linux Fundamentals covers the core concepts needed to navigate, manage, and understand Linux systems — the foundation for everything in offensive and defensive security. Most CTF machines and real-world targets run Linux, so fluency here is non-negotiable.

---

## 1. Introduction & The Shell

Linux is one of the most widely used operating systems in the world, particularly in servers, cloud infrastructure, and security tooling. One of the best ways to learn Linux is to experiment with it hands-on — not just read about it.

**Connecting to a remote Linux machine:**

```bash
ssh htb-student@<ip-address>
```

The shell is the primary interface for interacting with a Linux system. It interprets commands and passes them to the operating system for execution. Common shells include `bash` (Bourne Again Shell), `zsh`, and `sh`.

**Basic navigation:**

```bash
pwd             # print working directory — where you currently are
ls -la          # list all files including hidden, with permissions and metadata
cd /path        # change to a specific directory
cd ..           # go up one directory
cd ~            # go to home directory
```

---

## 2. File Permissions

Every file and directory in Linux has associated permissions that control who can read, write, or execute it. Understanding permissions is critical — misconfigurations are one of the most common privilege escalation vectors in CTFs and real environments.

**Permission format:**

-rwxr-xr-- 1 owner group size date filename
| Position | Meaning |
|---|---|
| `-` | File type (`-` regular file, `d` directory, `l` symbolic link) |
| `rwx` | Owner permissions (read, write, execute) |
| `r-x` | Group permissions |
| `r--` | Other/world permissions |

**Reading the permission string:**

- Each permission group has 3 characters: `r` (read=4), `w` (write=2), `x` (execute=1)
- The number after permissions (e.g. `1` or `2`) is the **hard link count**
- A directory with 2 hard links means it has `.` (itself) and `..` (parent) as minimum entries

**Changing permissions:**

```bash
chmod 755 file        # owner: rwx (7), group: r-x (5), other: r-x (5)
chmod +x file         # add execute permission for all
chmod u+w file        # add write permission for owner only
chown user:group file # change owner and group
chown user file       # change owner only
```

**Octal permission reference:**

| Octal | Binary | Permissions |
| ----- | ------ | ----------- |
| 7     | 111    | rwx         |
| 6     | 110    | rw-         |
| 5     | 101    | r-x         |
| 4     | 100    | r--         |
| 0     | 000    | ---         |

**Why this matters for CTF/pentest:**

- World-writable files (`-rw-rw-rw-`) can be modified by any user
- SUID bit (`-rwsr-xr-x`) means the file runs as the owner — if owned by root, this is a privesc vector
- Finding SUID binaries: `find / -perm -4000 2>/dev/null`

---

## Key Takeaways — Section 1

- The shell is the primary interface for Linux — fluency here is non-negotiable for CTF work
- SSH is the standard way to connect to remote Linux machines (`ssh user@ip`)
- File permissions are a fundamental attack surface — misconfigurations lead directly to privilege escalation
- Always check SUID binaries and writable files early in post-exploitation enumeration
