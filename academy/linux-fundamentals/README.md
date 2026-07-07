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

Inodes are data structures that store metadata about each file and directory, including:

- Permissions
- Ownership
- Size
- Timestamps (created, modified, accessed)

**Important:** Inodes do NOT store the file's actual data or its name — they only store pointers to where the file's data is stored on the disk. The filename-to-inode mapping is stored in the directory itself.

```bash
ls -i file          # show inode number of a file
stat file           # show full inode information
df -i               # show inode usage across filesystems
```

### Network File System (NFS)

NFS is a network protocol that allows commands on a network to share and manage files. It allows systems on a network to access files on remote systems as if they were stored on the local system.

```bash
showmount -e <ip>                       # show NFS shares on a remote host
mount -t nfs <ip>:/share /mnt/nfs       # mount a remote NFS share
```

**Why this matters for CTF/pentest:**

- Misconfigured NFS shares (no_root_squash) can allow privilege escalation
- Always check for NFS shares during enumeration

---

## 4. Filter Tools & Working with Text

Linux provides powerful tools for filtering, searching, and processing text output. These are essential for parsing command output, log files, and configuration files during enumeration.

```bash
grep "pattern" file          # search for a pattern in a file
grep -r "pattern" /path/     # recursive search across directories
grep -v "pattern" file       # invert match — show lines that do NOT match
grep -i "pattern" file       # case-insensitive search
```

```bash
cat file                     # print entire file contents
head -n 20 file              # show first 20 lines
tail -n 20 file              # show last 20 lines
tail -f file                 # follow file in real time (useful for logs)
wc -l file                   # count number of lines
sort file                    # sort lines alphabetically
sort -u file                 # sort and remove duplicates
uniq file                    # remove consecutive duplicate lines
```

```bash
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

Linux has several types of files — understanding them helps during enumeration and exploitation.

**Regular files** store data such as text, images, and binary data. They reside on the file system and are the most common file type.

**Directories** are special types of files that act as containers for other files and directories. When a file is referenced in a directory, that directory is referred to as the file's **parent directory**. They help organize files within the Linux file system to manage clutter.

**Symbolic links (symlinks)** give access to files without duplicating the file itself. A symlink is a pointer to another file or directory — it allows quick access to files without duplicating the actual data.

```bash
ls -la                          # symlinks shown with -> pointing to target
ln -s /path/target linkname     # create a symbolic link
readlink linkname               # show where a symlink points
```

**Why symlinks matter for CTF/pentest:**

- Writable symlinks pointing to sensitive files can be abused
- Race conditions involving symlinks (`/tmp` symlink attacks) are a classic privesc technique

**File types summary:**

| Type             | Symbol | Description                            |
| ---------------- | ------ | -------------------------------------- |
| Regular file     | `-`    | Standard data file                     |
| Directory        | `d`    | Container for files                    |
| Symbolic link    | `l`    | Pointer to another file                |
| Block device     | `b`    | Storage device (hard drive, USB)       |
| Character device | `c`    | Sequential device (keyboard, terminal) |
| Socket           | `s`    | Inter-process communication            |
| Named pipe       | `p`    | FIFO inter-process communication       |

---

### Disk Management

Disk management in Linux involves managing physical storage devices including hard drives, SSDs, and removable storage. The key tool is `fdisk` — it allows disk management to create, delete, and manage partitions on a drive. It can also display information about the size and type of each partition.

**Partitioning** a drive on Linux involves dividing the physical storage space into separate logical sections.

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

---

### Mounting

Mounting involves linking a drive or partition to a directory, making its contents accessible within the overall file system hierarchy. Without mounting, a disk or partition is inaccessible even if it's physically connected.

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
- World-readable mount points are worth investigating

---

## 6. Swap, Containerization & Package Management

### Swap Space

Swap space is an essential part of memory management in Linux and plays a vital role in ensuring smooth system performance when the available physical memory (RAM) is fully utilized. When RAM runs out, the kernel moves inactive memory pages to swap space on disk to free up RAM for active processes.

```bash
mkswap /dev/sdb2        # format a partition as swap
swapon /dev/sdb2        # enable the swap partition
swapoff /dev/sdb2       # disable the swap partition
swapon --show           # show active swap spaces
free -h                 # show RAM and swap usage
```

**Swap file alternative (no dedicated partition needed):**

```bash
fallocate -l 2G /swapfile       # create a 2GB swap file
chmod 600 /swapfile             # secure it — only root can read/write
mkswap /swapfile                # format as swap
swapon /swapfile                # enable it
```

---

### Containerization

Containerization is the process of packaging and running applications in isolated environments. Containers are process-isolated, lightweight, and typically deployed to run the same way regardless of where they are deployed — eliminating the "works on my machine" problem.

**Key tools:**

| Tool                       | Description                                                               |
| -------------------------- | ------------------------------------------------------------------------- |
| **Docker**                 | Most widely used container platform — packages apps with all dependencies |
| **Linux Containers (LXC)** | OS-level virtualization — closer to a lightweight VM than Docker          |
| **Docker Compose**         | Define and run multi-container applications with a single config file     |

```bash
docker ps                       # list running containers
docker ps -a                    # list all containers including stopped
docker images                   # list available images
docker run -it ubuntu bash      # run an interactive Ubuntu container
docker exec -it <id> bash       # get a shell inside a running container
```

**Why this matters for CTF/pentest:**

- Docker group membership = effective root — always check `id` for docker group
- Misconfigured containers with mounted host volumes can be escaped
- Check for `.dockerenv` in the root directory to detect if you're inside a container

---

### Package Management

A package is an archive file containing multiple data files — binaries, configuration files, documentation — along with metadata about the package. Package managers handle installation, updates, and removal cleanly.

**Common package managers:**

| Manager | Distro             | Usage                 |
| ------- | ------------------ | --------------------- |
| `apt`   | Debian, Ubuntu     | `apt install <pkg>`   |
| `dpkg`  | Debian, Ubuntu     | `dpkg -i package.deb` |
| `snap`  | Universal          | `snap install <pkg>`  |
| `pip`   | Python packages    | `pip install <pkg>`   |
| `gem`   | Ruby packages      | `gem install <pkg>`   |
| `git`   | Source from GitHub | `git clone <url>`     |

```bash
apt update                      # update package list
apt upgrade                     # upgrade all installed packages
apt install <package>           # install a package
apt remove <package>            # remove a package
apt search <package>            # search for a package
dpkg -l                         # list all installed packages
dpkg -l | grep <name>           # check if a specific package is installed
```

**Why this matters for CTF/pentest:**

- Outdated packages with known CVEs are a common attack surface
- `dpkg -l` after foothold reveals installed software versions to check for exploits
- `pip` and `gem` packages installed as root can sometimes be hijacked

---

## 7. Linux Networking & Network Configuration

### Linux Networking Overview

One of the primary tasks of Linux networking is managing network interfaces — this involves assigning IP addresses, configuring network devices such as routers and switches, and setting up various network protocols including TCP/IP.

```bash
ip a                            # show all network interfaces and IP addresses
ip r                            # show routing table
ip link show                    # show network interface status
ifconfig                        # older alternative to ip a
```

### Configuring Network Interfaces

```bash
ifconfig eth0 192.168.1.100 netmask 255.255.255.0    # set IP (temporary)
ip addr add 192.168.1.100/24 dev eth0                # set IP using ip command
ip link set eth0 up                                   # bring interface up
ip link set eth0 down                                 # bring interface down
```

**DNS configuration:**

```bash
cat /etc/resolv.conf            # show current DNS servers
cat /etc/hosts                  # local hostname to IP mappings
```

Updating DNS settings is done by editing `/etc/resolv.conf` or updating via `systemd-resolved`. Restarting the networking service applies changes:

```bash
systemctl restart networking        # Debian/Ubuntu
systemctl restart NetworkManager    # modern systems
```

---

### Network Access Control

Network access control determines who can access what on the network. There are three primary models:

| Model    | Full Name                    | Controlled By                                        |
| -------- | ---------------------------- | ---------------------------------------------------- |
| **DAC**  | Discretionary Access Control | The resource owner — owner decides who can access    |
| **MAC**  | Mandatory Access Control     | The operating system — enforced by policy, not owner |
| **RBAC** | Role-Based Access Control    | Roles assigned to users — access based on role       |

**Permission-based enforcement tools:**

| Tool          | Purpose                                                          |
| ------------- | ---------------------------------------------------------------- |
| `syslog`      | System logging daemon                                            |
| `rsyslog`     | Enhanced syslog with filtering and remote logging                |
| `ss`          | Modern socket statistics tool                                    |
| **ELK Stack** | Elasticsearch + Logstash + Kibana — log aggregation and analysis |

```bash
ss -tln                         # show listening TCP ports
ss -tulnp                       # show all listening sockets with process info
```

---

### Network Monitoring

Network monitoring involves capturing, analysing, and interpreting network traffic to identify security threats, performance issues, and suspicious behaviour.

```bash
tcpdump -i eth0                 # capture traffic on eth0
tcpdump -i eth0 port 80         # capture only HTTP traffic
tcpdump -w capture.pcap         # write capture to file
wireshark                       # GUI packet analyser
netstat -tlnp                   # show listening ports with processes (older)
ss -tulnp                       # modern alternative to netstat
```

---

### Troubleshooting Network Connectivity

```bash
ping <host>                     # test basic connectivity
traceroute <host>               # trace the network path to a host
nmap -sn <ip-range>             # ping sweep to discover live hosts
dig <domain>                    # detailed DNS lookup
nslookup <domain>               # simple DNS lookup
curl -I http://<host>           # check HTTP response headers
```

**Key troubleshooting tools:**

| Tool         | Purpose                                         |
| ------------ | ----------------------------------------------- |
| `ping`       | Test basic connectivity                         |
| `netstat`    | Display active connections and listening ports  |
| `traceroute` | Trace path packets take to reach a host         |
| `tcpdump`    | Capture and analyse packets at the command line |
| `wireshark`  | GUI packet analyser                             |
| `nmap`       | Network discovery and port scanning             |

---

### Secure Shell (SSH)

SSH (Secure Shell) is a network protocol that allows the secure transmission of data and commands over a network. It is the standard way to remotely manage Linux systems.

```bash
ssh user@<ip>                           # connect to remote host
ssh -p 2222 user@<ip>                   # connect on non-standard port
ssh -i key.pem user@<ip>               # connect using a private key
ssh -L 8080:localhost:80 user@<ip>      # local port forwarding
ssh -D 9050 user@<ip>                   # dynamic SOCKS proxy
```

**Why SSH matters for CTF/pentest:**

- SSH keys found on a compromised machine can grant access to other hosts
- Port forwarding via SSH is used to pivot through networks and access internal services
- Always check `~/.ssh/` for private keys, `authorized_keys`, and `known_hosts`

---

## 8. Linux Hardening & Security

### Firewall Setup

A firewall is a security mechanism for controlling and monitoring network traffic between different network segments — such as internal and external networks, or different zones.

**iptables** is the primary firewall tool on Linux. It uses tables, chains, rules, and targets to control the output of network traffic.

```bash
iptables -L                             # list all firewall rules
iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # allow SSH
iptables -A INPUT -j DROP              # drop all other incoming traffic
iptables -F                            # flush all rules
```

---

### Hardening Tools

Linux provides several tools to harden systems against attacks. These are designed to safeguard Linux systems against various security threats, from unauthorized access to malicious attacks.

| Tool             | Type           | Description                                                                                                              |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **SELinux**      | MAC system     | Security-Enhanced Linux — enforces mandatory access control policies at the kernel level                                 |
| **AppArmor**     | MAC system     | Simpler alternative to SELinux — restricts programs by profile                                                           |
| **TCP Wrappers** | Network filter | Restricts access to network services based on IP addresses of incoming connections — uses `hosts.allow` and `hosts.deny` |

**SELinux** (Security-Enhanced Linux):

- A MAC system built into the Linux kernel
- Enforces fine-grained access control policies
- Every process and file has a security context — access is only granted if the policy explicitly allows it

**AppArmor**:

- A MAC system that restricts programs based on per-program profiles
- Simpler to configure than SELinux
- Profiles define what files, capabilities, and network access a program is allowed

**TCP Wrappers**:

- Restricts access to network services based on IP addresses of incoming connections
- Configured via `/etc/hosts.allow` and `/etc/hosts.deny`

```bash
sestatus                        # check SELinux status
aa-status                       # check AppArmor status
cat /etc/hosts.allow            # show allowed hosts for TCP wrappers
cat /etc/hosts.deny             # show denied hosts for TCP wrappers
```

---

### Remote Desktop Protocols on Linux

Linux supports several remote desktop protocols for graphical access to remote systems.

**X Server (X11):**

- The X Window System network protocol
- TCP ports 6001-6007 (unencrypted/insecure by default)
- X11 security involves `xhost` and `xauth` controls

**XDMCP** (X Display Manager Control Protocol):

- Allows remote graphical login sessions
- Considered insecure — unencrypted

**VNC (Virtual Network Computing):**

- Allows remote desktop access over a network
- Common VNC tools:

| Tool     | Notes                              |
| -------- | ---------------------------------- |
| TigerVNC | Open source, widely used           |
| RealVNC  | Commercial, cross-platform         |
| UltraVNC | Windows-focused but cross-platform |

Most tools use UltraVNC or RealVNC. Always encrypt VNC connections by setting up an **SSH tunnel**:

```bash
ssh -L 5901:localhost:5901 user@<ip>    # tunnel VNC through SSH
vncviewer localhost:5901                # connect through the tunnel
```

**RDP (Remote Desktop Protocol):**

- Windows protocol — port 3389
- Can be used on Linux via `xfreerdp` or `rdesktop`

```bash
xfreerdp /u:user /p:password /v:<ip>   # connect to Windows RDP from Linux
```

---

### System Logs & Monitoring

System logs are a set of files that contain information about the system and the activities taking place in it. Logs are critical for detecting intrusions, troubleshooting issues, and maintaining audit trails.

**Types of system logs on Linux:**

| Log Type            | Location                 | Contents                                    |
| ------------------- | ------------------------ | ------------------------------------------- |
| Kernel logs         | `/var/log/kern.log`      | Kernel events, hardware errors              |
| System logs         | `/var/log/syslog`        | General system activity                     |
| Authentication logs | `/var/log/auth.log`      | Login attempts, sudo usage, SSH connections |
| Application logs    | `/var/log/<app>/`        | Application-specific events                 |
| Security logs       | `/var/log/secure` (RHEL) | Security-related events                     |

```bash
tail -f /var/log/auth.log       # watch authentication events in real time
grep "Failed password" /var/log/auth.log    # find failed SSH login attempts
grep "sudo" /var/log/auth.log   # find sudo usage
journalctl -u ssh               # show SSH service logs via systemd
journalctl -f                   # follow all system logs in real time
```

**Log management tools:**

| Tool          | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `syslog`      | Standard logging daemon                                      |
| `rsyslog`     | Enhanced syslog — filtering, remote logging                  |
| `auditd`      | Linux audit daemon — detailed security event logging         |
| **ELK Stack** | Elasticsearch + Logstash + Kibana — centralised log analysis |

**`auditd`** (Linux Audit Daemon):

- Records detailed security events — file access, system calls, login attempts
- Access and audit logs — events often recorded in security logs
- Location of log files depends on specific application and security configuration

```bash
auditctl -l                     # list active audit rules
ausearch -m LOGIN               # search audit log for login events
aureport --auth                 # authentication report from audit log
```

**Why this matters for CTF/pentest:**

- Auth logs reveal usernames, IP addresses, and timing of login attempts
- Kernel logs can reveal hardware and driver information useful for privesc
- On a compromised machine — clearing logs is a common attacker action, checking for gaps is a detection technique

---

## 9. Linux Distributions vs Solaris

### Key Differences

Linux distributions and Solaris (Oracle Solaris) are both Unix-like operating systems but differ significantly in their design, use cases, and features.

| Feature                | Linux                                  | Solaris                                 |
| ---------------------- | -------------------------------------- | --------------------------------------- |
| **File system**        | ext4, Btrfs, XFS (default varies)      | ZFS (default — advanced features)       |
| **Process management** | `ps`, `top`, `systemd`                 | `ps`, `prstat` (Solaris-specific)       |
| **Package management** | `apt`, `yum`, `dnf` (varies by distro) | IPS (Image Packaging System)            |
| **Kernel**             | Linux kernel — open source             | Solaris kernel — proprietary (Oracle)   |
| **Hardware support**   | Broad — thousands of drivers           | Focused on SPARC and x86 enterprise     |
| **System monitoring**  | `top`, `htop`, `vmstat`                | `prstat`, `dtrace`                      |
| **Security**           | SELinux, AppArmor                      | Solaris Zones, RBAC, Trusted Extensions |

**ZFS** (Zettabyte File System) — Solaris default:

- Advanced features: snapshots, data integrity checksums, built-in RAID
- Now also available on Linux via OpenZFS

**Solaris Zones:**

- Lightweight virtualization similar to Linux containers
- Each zone is an isolated environment within the same OS instance

---

## 10. Tips & Tricks

### Essential Shortcuts

| Shortcut    | Action                                           |
| ----------- | ------------------------------------------------ |
| `Ctrl+C`    | Kill the current running process                 |
| `Ctrl+Z`    | Suspend the current process (send to background) |
| `Ctrl+D`    | Exit the current shell / send EOF                |
| `Ctrl+L`    | Clear the terminal screen                        |
| `Ctrl+R`    | Reverse search through command history           |
| `Ctrl+A`    | Move cursor to beginning of line                 |
| `Ctrl+E`    | Move cursor to end of line                       |
| `Ctrl+W`    | Delete the word before the cursor                |
| `!!`        | Repeat the last command                          |
| `!<number>` | Repeat command by history number                 |
| `sudo !!`   | Re-run last command with sudo                    |

### Auto-complete

- Press `Tab` once to auto-complete a command, filename, or path
- Press `Tab` twice to show all possible completions when there are multiple options
- Works for commands, file paths, and command arguments on most shells

### Useful One-liners for CTF/Pentest

```bash
# Find all SUID binaries
find / -perm -4000 2>/dev/null

# Find world-writable files
find / -writable -type f 2>/dev/null | grep -v proc

# Find files modified in the last 10 minutes
find / -mmin -10 2>/dev/null

# Search for passwords in config files
grep -r "password" /etc/ 2>/dev/null

# List all users with a shell
cat /etc/passwd | grep -v "nologin\|false"

# Check sudo permissions
sudo -l

# Check running processes
ps aux

# Check listening ports
ss -tulnp

# Check cron jobs
crontab -l && cat /etc/crontab

# Check kernel version (for kernel exploits)
uname -a

# Check OS version
cat /etc/os-release
```

---

## Key Takeaways — Full Module

- The shell is the primary interface for Linux — fluency here is non-negotiable for CTF work
- SSH is the standard way to connect to remote Linux machines — always check `~/.ssh/` after gaining access
- File permissions are a fundamental attack surface — SUID, world-writable files, and symlinks all lead to privesc
- Inodes store metadata, not data — useful for forensic investigation and understanding file system anomalies
- NFS and Docker misconfigurations are classic privilege escalation vectors — always check both
- `grep`, `find`, and pipes are the most-used tools during enumeration — master them
- `ss -tulnp` replaces `netstat` on modern systems — shows listening ports with process info
- SELinux and AppArmor enforce MAC policies — understanding them helps bypass defences on hardened targets
- Auth logs (`/var/log/auth.log`) reveal login attempts, sudo usage, and SSH connections — critical for both attack and defence
- `Ctrl+R` reverse history search and `Tab` autocomplete are two of the most time-saving shell habits to build early
- ZFS (Solaris) vs ext4/Btrfs (Linux) — know the difference when you encounter Solaris in CTF or enterprise environments

---

## Resources

- [HackTheBox Academy — Linux Fundamentals](https://academy.hackthebox.com/module/details/18)
- [GTFOBins](https://gtfobins.github.io) — SUID/sudo binary abuse reference
- [Linux Privilege Escalation Guide](https://book.hacktricks.xyz/linux-hardening/privilege-escalation)
- [iptables documentation](https://netfilter.org/documentation/)
- [SELinux User Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/index)
