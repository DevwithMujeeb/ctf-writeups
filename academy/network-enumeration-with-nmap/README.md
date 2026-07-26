# Network Enumeration With Nmap — HackTheBox Academy

**Module:** Network Enumeration With Nmap
**Platform:** HackTheBox Academy
**Path:** Junior Cybersecurity Analyst (CJCA)
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Network Enumeration With Nmap is the practical application of everything covered in Network Foundations and Introduction To Networking. Where those modules explained how networks and protocols work, this module shows how to actively interrogate them — discovering hosts, mapping services, identifying versions, and extracting information that shapes every subsequent phase of a penetration test.

Nmap (Network Mapper) is the industry-standard tool for network discovery and security auditing. It is open source, runs on Linux, Windows, and macOS, and is used by both penetration testers and system administrators. Understanding Nmap deeply — not just copying commands — is what separates effective enumeration from noisy, incomplete scanning.

---

## 1. What Is Nmap?

**Nmap** is a free, open-source network scanner used to discover hosts and services on a network by sending packets and analysing responses. It can determine:

- Which hosts are alive on a network
- What ports are open on those hosts
- What services and versions are running on those ports
- What operating system the host is running
- What vulnerabilities may be present based on service versions
  Nmap is used at multiple phases of a penetration test:
- **Reconnaissance** — host discovery, network mapping
- **Scanning** — port scanning, service detection
- **Enumeration** — pulling detailed information from services via NSE scripts
- **Vulnerability identification** — running vuln scripts against discovered services

### Basic Nmap Syntax

```bash
nmap [scan type] [options] <target>
```

Target formats:

```bash
nmap 10.129.2.28              # Single IP
nmap 10.129.2.1-254           # IP range
nmap 10.129.2.0/24            # CIDR subnet
nmap -iL targets.txt          # IP list from file
nmap scanme.nmap.org          # Hostname
```

---

## 2. Host Discovery

Before scanning ports, you need to know which hosts are alive on the network. Host discovery is the process of identifying active systems within a target range.

### Host Discovery Methods

**Scan a network range — discover live hosts:**

```bash
sudo nmap 10.129.2.0/24 -sn -oA tnet | grep -E "report|Host"
```

`-sn` disables port scanning — only performs host discovery.

**Scan from an IP list:**

```bash
sudo nmap -sn -oA tnet -iL hosts.lst | grep -E "report|Host"
```

**Scan multiple IPs:**

```bash
sudo nmap 10.129.2.18 10.129.2.19 10.129.2.20 -sn
```

**Scan a single IP:**

```bash
sudo nmap 10.129.2.28 -sn
```

### How Host Discovery Works

By default when scanning a network, Nmap sends:

- **ICMP Echo Request** (ping) — checks if host responds
- **TCP SYN to port 443** — checks if HTTPS port responds
- **TCP ACK to port 80** — checks if HTTP port responds
- **ICMP Timestamp Request** — alternative host detection
  When scanning a single host, Nmap skips the ping sweep and goes straight to port scanning.

### Disabling Host Discovery

Sometimes ICMP is blocked by firewalls — hosts appear dead but are actually alive. Disable host discovery to force scanning:

```bash
# Disable ICMP, DNS resolution, and ARP ping to trace packets
sudo nmap 10.129.2.28 -Pn -n --disable-arp-ping
```

| Flag                 | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `-Pn`                | Disable ICMP ping — treat all hosts as alive               |
| `-n`                 | Disable DNS resolution — speeds up scanning, reduces noise |
| `--disable-arp-ping` | Disable ARP ping on local networks                         |

---

## 3. Port Scanning

After confirming which hosts are alive, port scanning determines what is running on each host. After finding our target alive, we want to get a more accurate picture of the system. The information we need includes:

- Open ports and their services
- Service versions
- Information that the services provided
- Operating system

### Default Nmap Behaviour

By default, Nmap scans the **top 1000 TCP ports** using the **SYN scan (`-sS`)**.

```bash
sudo nmap 10.129.2.28
```

### Scan Types

**SYN Scan (`-sS`) — Stealth Scan**

```bash
sudo nmap 10.129.2.28 -sS
```

- Sends SYN packet, waits for SYN-ACK (open) or RST (closed)
- Never completes the three-way handshake — connection not fully established
- Stealthy — many older logging systems only log completed connections
- Requires root/sudo
  **TCP Connect Scan (`-sT`)**

```bash
nmap 10.129.2.28 -sT
```

- Completes the full three-way handshake
- Slower and more detectable than SYN scan
- Does not require root privileges — useful when running without elevated access
  **UDP Scan (`-sU`)**

```bash
sudo nmap 10.129.2.28 -sU
```

- Scans UDP ports
- Slower than TCP scanning — UDP has no handshake mechanism
- Closed UDP ports return ICMP "port unreachable"; open ports often return nothing
- Essential for finding DNS (53), SNMP (161), NTP (123)
  **Scan specific ports:**

```bash
sudo nmap 10.129.2.28 -p 22,80,443,445,3389
sudo nmap 10.129.2.28 -p 1-1000
sudo nmap 10.129.2.28 -p-              # All 65535 ports
sudo nmap 10.129.2.28 --top-ports=100  # Top 100 most common ports
```

---

## Key Takeaways — Section 1

- Nmap is the foundation of network enumeration — every penetration test starts here
- Host discovery comes before port scanning — confirm targets are alive before scanning them
- `-Pn` forces scanning even when ICMP is blocked — never assume a host is down because it doesn't respond to ping
- SYN scan (`-sS`) is the default and most common — stealthy, fast, requires root
- TCP connect scan (`-sT`) is the fallback without root — louder but functional
- UDP scanning is slow but essential — DNS, SNMP, and NTP are UDP services that won't appear in TCP-only scans
- Scanning all 65535 ports (`-p-`) takes longer but finds services running on non-standard ports
