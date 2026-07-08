# Linux Fundamentals — HackTheBox Academy

**Module:** Linux Fundamentals
**Platform:** HackTheBox Academy
**Status:** ✅ Completed
**Sections:** 30 sections · 21 Interactive
**Completed:** July 2026

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

```
-rwxr-xr--  1  owner  group  size  date  filename
```

| Position | Meaning                                                        |
| -------- | -------------------------------------------------------------- |
| `-`      | File type (`-` regular file, `d` directory, `l` symbolic link) |
| `rwx`    | Owner permissions (read, write, execute)                       |
| `r-x`    | Group permissions                                              |
| `r--`    | Other/world permissions                                        |

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

## 3. File System Management

The Linux file system involves organizing, storing, and managing data on a disk or other storage device. Different file storage types include **ext3**, **ext4**, **Btrfs**, **XFS**, and **NFS** — each with different performance characteristics and use cases.

### Inodes

Inodes are data structures that store metadata about each file and directory, including permissions, ownership, size, and timestamps. Inodes do NOT store the file's actual data or its name — they only store pointers to where the file's data is stored on the disk. The filename-to-inode mapping is stored in the directory itself.

```bash
ls -i file          # show inode number of a file
stat file           # show full inode information
df -i               # show inode usage across filesystems
```

### Network File System (NFS)

NFS is a network protocol that allows systems on a network to access files on remote systems as if they were stored locally.

```bash
showmount -e <ip>                       # show NFS shares on a remote host
mount -t nfs <ip>:/share /mnt/nfs       # mount a remote NFS share
```

**Why this matters for CTF/pentest:**

- Misconfigured NFS shares (`no_root_squash`) can allow privilege escalation
- Always check for NFS shares during enumeration

---

## 4. Filter Tools & Working with Text

Linux provides powerful tools for filtering, searching, and processing text output — essential for parsing command output, log files, and configuration files during enumeration.

```bash
grep "pattern" file          # search for a pattern in a file
grep -r "pattern" /path/     # recursive search across directories
grep -v "pattern" file       # invert match — show lines that do NOT match
grep -i "pattern" file       # case-insensitive search
cat file                     # print entire file contents
head -n 20 file              # show first 20 lines
tail -n 20 file              # show last 20 lines
tail -f file                 # follow file in real time (useful for logs)
wc -l file                   # count number of lines
sort file                    # sort lines alphabetically
sort -u file                 # sort and remove duplicates
uniq file                    # remove consecutive duplicate lines
cut -d: -f1 /etc/passwd      # extract first field using : as delimiter
awk '{print $1}' file        # print first column of each line
sed 's/old/new/g' file       # find and replace globally in a file
```

**Using pipes to chain commands:**

```bash
cat /etc/passwd | grep "/bin/bash"           # find users with bash shell
ps aux | grep "apache"                       # find apache processes
cat access.log | sort | uniq -c | sort -rn   # count unique entries
find / -name "*.conf" 2>/dev/null | grep -v "proc"  # find config files
```

**Why this matters for CTF/pentest:**

- `grep -r "password"` across config directories often finds credentials
- Piping `find` output through `grep` is a core enumeration pattern
- `tail -f /var/log/auth.log` shows live authentication attempts

---

## 5. File Types, Disk Management & Mounting

### File Types in Linux

| Type             | Symbol | Description                                 |
| ---------------- | ------ | ------------------------------------------- |
| Regular file     | `-`    | Standard data file — text, images, binaries |
| Directory        | `d`    | Container for files and other directories   |
| Symbolic link    | `l`    | Pointer to another file or directory        |
| Block device     | `b`    | Storage device (hard drive, USB)            |
| Character device | `c`    | Sequential device (keyboard, terminal)      |
| Socket           | `s`    | Inter-process communication                 |
| Named pipe       | `p`    | FIFO inter-process communication            |

**Symbolic links (symlinks)** give access to files without duplicating the file itself — quick access without duplicating actual data.

```bash
ln -s /path/target linkname     # create a symbolic link
readlink linkname               # show where a symlink points
```

**Why symlinks matter for CTF/pentest:**

- Writable symlinks pointing to sensitive files can be abused
- Race conditions involving symlinks (`/tmp` symlink attacks) are a classic privesc technique

### Disk Management

`fdisk` allows disk management — create, delete, and manage partitions on a drive.

```bash
fdisk -l                    # list all disks and partitions
fdisk /dev/sda              # open interactive partition manager for sda
lsblk                       # list block devices in a tree view
blkid                       # show block device UUIDs and filesystem types
parted /dev/sda print       # show partition table using parted
```

**Common partitioning tools:**

| Tool      | Description                              |
| --------- | ---------------------------------------- |
| `fdisk`   | Classic partition manager — command line |
| `gpart`   | BSD partition tool                       |
| `GParted` | Graphical partition editor (GUI)         |

### Mounting

Mounting involves linking a drive or partition to a directory, making its contents accessible within the overall file system hierarchy.

```bash
mount /dev/sdb1 /mnt/usb       # mount a partition to a directory
umount /mnt/usb                # unmount
mount -t ext4 /dev/sdb1 /mnt   # mount specifying filesystem type
df -h                          # show mounted filesystems and disk usage
cat /etc/fstab                 # show filesystems configured to mount at boot
```

**Why this matters for CTF/pentest:**

- `/etc/fstab` can reveal NFS shares, unusual mount points, and misconfigurations
- Unmounted partitions may contain sensitive data — always check `lsblk` and `fdisk -l`

---

## 6. Swap, Containerization & Package Management

### Swap Space

Swap space is an essential part of memory management in Linux — when available physical memory (RAM) is fully utilized, the kernel moves inactive memory pages to swap space on disk.

```bash
mkswap /dev/sdb2        # format a partition as swap
swapon /dev/sdb2        # enable the swap partition
swapoff /dev/sdb2       # disable the swap partition
swapon --show           # show active swap spaces
free -h                 # show RAM and swap usage
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
```

### Containerization

Containerization is the process of packaging and running applications in isolated environments — deployed the same way regardless of where they run.

| Tool                       | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| **Docker**                 | Most widely used container platform                  |
| **Linux Containers (LXC)** | OS-level virtualization — closer to a lightweight VM |
| **Docker Compose**         | Multi-container application management               |

```bash
docker ps                       # list running containers
docker ps -a                    # list all containers including stopped
docker images                   # list available images
docker run -it ubuntu bash      # run an interactive Ubuntu container
docker exec -it <id> bash       # get a shell inside a running container
```

**Why this matters for CTF/pentest:**

- Docker group membership = effective root — always check `id` for docker group
- Check for `.dockerenv` in `/` to detect if you're inside a container
- Misconfigured containers with mounted host volumes can be escaped

### Package Management

A package is an archive file containing binaries, configuration files, and documentation. Package managers handle installation, updates, and removal cleanly.

| Manager | Distro             | Usage                 |
| ------- | ------------------ | --------------------- |
| `apt`   | Debian, Ubuntu     | `apt install <pkg>`   |
| `dpkg`  | Debian, Ubuntu     | `dpkg -i package.deb` |
| `snap`  | Universal          | `snap install <pkg>`  |
| `pip`   | Python packages    | `pip install <pkg>`   |
| `gem`   | Ruby packages      | `gem install <pkg>`   |
| `git`   | Source from GitHub | `git clone <url>`     |

```bash
apt update && apt upgrade       # update and upgrade all packages
apt install <package>           # install a package
apt remove <package>            # remove a package
dpkg -l                         # list all installed packages
dpkg -l | grep <name>           # check if a specific package is installed
```

**Why this matters for CTF/pentest:**

- Outdated packages with known CVEs are a common attack surface
- `dpkg -l` reveals installed software versions to check for known exploits

---

## 7. Linux Networking & Network Configuration

### Network Interfaces

```bash
ip a                            # show all network interfaces and IP addresses
ip r                            # show routing table
ip link show                    # show network interface status
ifconfig                        # older alternative to ip a
ifconfig eth0 192.168.1.100 netmask 255.255.255.0    # set IP (temporary)
ip addr add 192.168.1.100/24 dev eth0                # set IP using ip command
ip link set eth0 up / down                           # bring interface up or down
cat /etc/resolv.conf            # show current DNS servers
cat /etc/hosts                  # local hostname to IP mappings
```

### Network Access Control

| Model    | Full Name                    | Controlled By           |
| -------- | ---------------------------- | ----------------------- |
| **DAC**  | Discretionary Access Control | The resource owner      |
| **MAC**  | Mandatory Access Control     | The operating system    |
| **RBAC** | Role-Based Access Control    | Roles assigned to users |

**Enforcement tools:**

| Tool                 | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `syslog` / `rsyslog` | System logging                                      |
| `ss`                 | Modern socket statistics                            |
| **ELK Stack**        | Elasticsearch + Logstash + Kibana — log aggregation |

### Network Monitoring & Troubleshooting

```bash
tcpdump -i eth0                 # capture traffic on eth0
tcpdump -i eth0 port 80         # capture only HTTP traffic
tcpdump -w capture.pcap         # write capture to file
ss -tulnp                       # show all listening sockets with process info
netstat -tlnp                   # older alternative to ss
ping <host>                     # test basic connectivity
traceroute <host>               # trace the network path to a host
nmap -sn <ip-range>             # ping sweep to discover live hosts
dig <domain>                    # detailed DNS lookup
curl -I http://<host>           # check HTTP response headers
```

### Secure Shell (SSH)

SSH (Secure Shell) allows secure transmission of data and commands over a network — the standard way to remotely manage Linux systems.

```bash
ssh user@<ip>                           # connect to remote host
ssh -p 2222 user@<ip>                   # connect on non-standard port
ssh -i key.pem user@<ip>               # connect using a private key
ssh -L 8080:localhost:80 user@<ip>      # local port forwarding
ssh -D 9050 user@<ip>                   # dynamic SOCKS proxy
```

**Why SSH matters for CTF/pentest:**

- SSH keys found on a compromised machine can grant access to other hosts
- Port forwarding via SSH is used to pivot through networks
- Always check `~/.ssh/` for private keys, `authorized_keys`, and `known_hosts`

---

## 8. Linux Hardening & Security

### Firewall Setup — iptables

`iptables` is the primary firewall tool on Linux. It uses tables, chains, rules, and targets to control network traffic.

```bash
iptables -L                                         # list all firewall rules
iptables -A INPUT -p tcp --dport 22 -j ACCEPT       # allow SSH
iptables -A INPUT -j DROP                           # drop all other incoming
iptables -F                                         # flush all rules
```

### Hardening Tools

| Tool             | Type           | Description                                                                |
| ---------------- | -------------- | -------------------------------------------------------------------------- |
| **SELinux**      | MAC system     | Enforces mandatory access control at the kernel level                      |
| **AppArmor**     | MAC system     | Restricts programs by per-program profiles                                 |
| **TCP Wrappers** | Network filter | Restricts network service access by IP — uses `hosts.allow` / `hosts.deny` |

```bash
sestatus                        # check SELinux status
aa-status                       # check AppArmor status
cat /etc/hosts.allow            # show allowed hosts for TCP wrappers
cat /etc/hosts.deny             # show denied hosts for TCP wrappers
```

### Remote Desktop Protocols

| Protocol | Port          | Notes                                               |
| -------- | ------------- | --------------------------------------------------- |
| X11      | TCP 6001-6007 | Unencrypted by default — tunnel through SSH         |
| VNC      | TCP 5900+     | Various tools: TigerVNC, RealVNC, UltraVNC          |
| RDP      | TCP 3389      | Windows protocol — access from Linux via `xfreerdp` |

```bash
ssh -L 5901:localhost:5901 user@<ip>    # tunnel VNC through SSH
vncviewer localhost:5901                # connect through the tunnel
xfreerdp /u:user /p:password /v:<ip>   # connect to Windows RDP from Linux
```

### System Logs & Monitoring

System logs are files that contain information about the system and the activities taking place in it — critical for detecting intrusions and maintaining audit trails.

| Log Type            | Location            | Contents                                    |
| ------------------- | ------------------- | ------------------------------------------- |
| Kernel logs         | `/var/log/kern.log` | Kernel events, hardware errors              |
| System logs         | `/var/log/syslog`   | General system activity                     |
| Authentication logs | `/var/log/auth.log` | Login attempts, sudo usage, SSH connections |
| Application logs    | `/var/log/<app>/`   | Application-specific events                 |
| Security logs       | `/var/log/secure`   | Security-related events (RHEL/CentOS)       |

```bash
tail -f /var/log/auth.log                   # watch authentication events live
grep "Failed password" /var/log/auth.log    # find failed SSH login attempts
grep "sudo" /var/log/auth.log               # find sudo usage
journalctl -u ssh                           # show SSH service logs
journalctl -f                               # follow all system logs live
auditctl -l                                 # list active audit rules
ausearch -m LOGIN                           # search audit log for login events
aureport --auth                             # authentication report
```

**Why this matters for CTF/pentest:**

- Auth logs reveal usernames, IP addresses, and timing of login attempts
- On a compromised machine — attackers often clear logs, checking for gaps is a detection technique

---

## 9. Linux Distributions vs Solaris

| Feature                | Linux                        | Solaris                                        |
| ---------------------- | ---------------------------- | ---------------------------------------------- |
| **File system**        | ext4, Btrfs, XFS             | ZFS (default — snapshots, integrity checksums) |
| **Process management** | `ps`, `top`, `systemd`       | `ps`, `prstat`                                 |
| **Package management** | `apt`, `yum`, `dnf`          | IPS (Image Packaging System)                   |
| **Kernel**             | Open source                  | Proprietary (Oracle)                           |
| **Hardware support**   | Broad — thousands of drivers | Focused on SPARC and x86 enterprise            |
| **Virtualization**     | Docker, LXC                  | Solaris Zones                                  |
| **Security**           | SELinux, AppArmor            | Solaris Zones, RBAC, Trusted Extensions        |

**ZFS** (Zettabyte File System) — Solaris default, now also available on Linux via OpenZFS:

- Advanced features: snapshots, data integrity checksums, built-in RAID

**Solaris Zones:**

- Lightweight virtualization — isolated environments within the same OS instance
- Similar to Linux containers but built into the OS

---

## 10. Tips & Tricks

### Essential Shortcuts

| Shortcut  | Action                                       |
| --------- | -------------------------------------------- |
| `Ctrl+C`  | Kill the current running process             |
| `Ctrl+Z`  | Suspend current process (send to background) |
| `Ctrl+D`  | Exit the current shell / send EOF            |
| `Ctrl+L`  | Clear the terminal screen                    |
| `Ctrl+R`  | Reverse search through command history       |
| `Ctrl+A`  | Move cursor to beginning of line             |
| `Ctrl+E`  | Move cursor to end of line                   |
| `Ctrl+W`  | Delete the word before the cursor            |
| `!!`      | Repeat the last command                      |
| `sudo !!` | Re-run last command with sudo                |

### Auto-complete

- Press `Tab` once to auto-complete a command, filename, or path
- Press `Tab` twice to show all possible completions when there are multiple options
- Works for commands, file paths, and command arguments on most shells

### Essential CTF/Pentest One-liners

```bash
# Privilege escalation enumeration
find / -perm -4000 2>/dev/null                          # SUID binaries
find / -writable -type f 2>/dev/null | grep -v proc     # writable files
find / -mmin -10 2>/dev/null                            # recently modified files
getcap -r / 2>/dev/null                                 # files with capabilities

# Credential hunting
grep -r "password" /etc/ 2>/dev/null                    # passwords in config files
grep -r "password" /var/www/ 2>/dev/null                # passwords in web files
find / -name "*.conf" 2>/dev/null | xargs grep -l "pass" 2>/dev/null

# User and permission enumeration
cat /etc/passwd | grep -v "nologin\|false"              # users with a shell
sudo -l                                                 # sudo permissions
id                                                      # current user and groups
cat /etc/crontab && crontab -l                          # cron jobs

# System information
uname -a                                                # kernel version
cat /etc/os-release                                     # OS version
ss -tulnp                                               # listening ports
ps aux                                                  # running processes
env                                                     # environment variables
```

---

## Key Takeaways — Full Module

- The shell is the primary interface for Linux — fluency here is non-negotiable for CTF work
- SSH is the standard way to connect to remote machines — always check `~/.ssh/` after gaining access
- File permissions are a fundamental attack surface — SUID, world-writable files, and symlinks all lead to privesc
- Inodes store metadata, not data — useful for forensic investigation
- NFS and Docker misconfigurations are classic privilege escalation vectors — always check both
- `grep`, `find`, and pipes are the most-used tools during enumeration — master them early
- `ss -tulnp` replaces `netstat` on modern systems — shows listening ports with process info
- SELinux and AppArmor enforce MAC policies — understanding them helps when encountering hardened targets
- Auth logs reveal login attempts, sudo usage, and SSH connections — critical for both attack and defence
- `Ctrl+R` reverse history search and `Tab` autocomplete are two of the most time-saving shell habits to build
- ZFS (Solaris) vs ext4/Btrfs (Linux) — know the difference when you encounter Solaris in enterprise environments

---

## Resources

- [HackTheBox Academy — Linux Fundamentals](https://academy.hackthebox.com/module/details/18)
- [GTFOBins](https://gtfobins.github.io) — SUID/sudo binary abuse reference
- [HackTricks — Linux Privilege Escalation](https://book.hacktricks.xyz/linux-hardening/privilege-escalation)
- [iptables documentation](https://netfilter.org/documentation/)
- [OpenZFS documentation](https://openzfs.github.io/openzfs-docs/)
