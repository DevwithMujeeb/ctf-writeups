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
ls -la              # symlinks shown with -> pointing to target
ln -s /path/target linkname    # create a symbolic link
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

## Key Takeaways — Sections 1-3

- The shell is the primary interface for Linux — fluency here is non-negotiable for CTF work
- SSH is the standard way to connect to remote Linux machines (`ssh user@ip`)
- File permissions are a fundamental attack surface — misconfigurations lead directly to privilege escalation
- Always check SUID binaries and writable files early in post-exploitation enumeration
- Inodes store metadata about files, not the data itself — understanding this helps when investigating file system anomalies
- NFS misconfiguration is a classic privilege escalation and lateral movement vector
- `grep`, `find`, and pipes are the most-used tools during enumeration — master them early
- Symlinks pointing to sensitive files and writable `/tmp` symlink attacks are classic CTF privesc techniques
- Always check `lsblk`, `fdisk -l`, and `/etc/fstab` after gaining a foothold — unmounted partitions may contain sensitive data
