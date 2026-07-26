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

---

## 4. Port States

Nmap reports one of six possible states for each scanned port. Understanding what each state means is critical for interpreting scan results correctly.

| State                | Description                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Open**             | The connection to the scanned port has been established — TCP, UDP, or SCTP. Indicates an application is actively accepting connections on this port           |
| **Closed**           | The port is accessible but no application is listening. Nmap receives a packet containing an RST flag. Still useful — confirms the host is alive               |
| **Filtered**         | Nmap cannot determine whether the port is open or closed. No response received or an error response returned. Usually indicates a firewall is dropping packets |
| **Unfiltered**       | Port is accessible but Nmap cannot determine if it is open or closed. Only appears during ACK scan (`-sA`)                                                     |
| **Open\|Filtered**   | Nmap cannot determine whether the port is open or filtered — no response received for open ports                                                               |
| **Closed\|Filtered** | Nmap cannot determine whether the port is closed or filtered. Only appears during IP ID idle scan                                                              |

**Security relevance:**

- **Open** → active attack surface — enumerate the service immediately
- **Closed** → confirms host is alive; service not running but port reachable
- **Filtered** → firewall present — try different scan techniques or evasion methods
- **Open\|Filtered** → common in UDP scans — service may be running but not responding

---

## 5. Output Formats

Nmap supports four output formats — always save scan results. You never want to re-run a lengthy scan because you forgot to save the output.

```bash
# Normal output — human readable
nmap 10.129.2.28 -oN scan_results.txt

# Grepable output — one line per host, easy to parse with grep/awk
nmap 10.129.2.28 -oG scan_results.gnmap

# XML output — machine readable, importable into tools like Metasploit
nmap 10.129.2.28 -oX scan_results.xml

# All formats simultaneously — creates three files with different extensions
nmap 10.129.2.28 -oA scan_results
```

**Best practice:** Always use `-oA` to save all formats. The grepable format is useful for quick filtering; XML imports directly into Metasploit and reporting tools.

```bash
# Search grepable output for open ports
grep "open" scan_results.gnmap

# Import XML into Metasploit database
msf6 > db_import scan_results.xml
msf6 > hosts
msf6 > services
```

---

## 6. Scan Performance and Timing

Nmap's scan speed is controlled by timing templates. Faster scans are noisier and more likely to trigger IDS/IPS. Slower scans are stealthier but take longer.

### Timing Templates (`-T`)

| Template | Name       | Description                                                  |
| -------- | ---------- | ------------------------------------------------------------ |
| `-T0`    | Paranoid   | Extremely slow — 5 minute delay between probes. IDS evasion  |
| `-T1`    | Sneaky     | Very slow — 15 second delay. IDS evasion                     |
| `-T2`    | Polite     | Slow — reduces bandwidth, less likely to crash services      |
| `-T3`    | Normal     | Default — balanced speed and accuracy                        |
| `-T4`    | Aggressive | Fast — assumes reliable network. Common for internal testing |
| `-T5`    | Insane     | Very fast — may miss results on slow networks                |

```bash
# Fast scan for internal network testing
sudo nmap 10.129.2.28 -T4 -p-

# Stealth timing for external engagements
sudo nmap 10.129.2.28 -T1 -sS
```

### Performance Options

```bash
# Set minimum packet rate (packets per second)
sudo nmap 10.129.2.28 --min-rate 5000

# Set maximum retries per port
sudo nmap 10.129.2.28 --max-retries 2

# Set scan timeout
sudo nmap 10.129.2.28 --host-timeout 30s

# Parallelism — number of simultaneous host probes
sudo nmap 10.129.2.28 --min-parallelism 100
```

**Recommended fast scan for CTF/lab environments:**

```bash
sudo nmap 10.129.2.28 -p- --min-rate 5000 -T4 -oA fast_scan
```

**Recommended thorough scan for professional engagements:**

```bash
sudo nmap 10.129.2.28 -p- -sV -sC -O --min-rate 1000 -T3 -oA thorough_scan
```

---

## 7. OS Detection and Aggressive Scanning

### OS Detection (`-O`)

Nmap fingerprints the operating system by analysing how the target responds to specific probe packets — TCP/IP stack behaviour differs between OS implementations.

```bash
sudo nmap 10.129.2.28 -O
```

OS detection reveals:

- Operating system family (Linux, Windows, BSD)
- OS version estimate
- Kernel version (Linux)
- Device type (router, switch, printer, general purpose)
  **TTL hints from ping responses:**
- Linux/Unix: TTL ≈ 64
- Windows: TTL ≈ 128
- Cisco: TTL ≈ 255

### Aggressive Scan (`-A`)

The aggressive scan combines four scan options into one flag:

```bash
sudo nmap 10.129.2.28 -A
```

`-A` enables:

- `-sV` — service version detection
- `-O` — OS detection
- `-sC` — default NSE scripts
- `--traceroute` — network path to target
  **Use `-A` when you want maximum information and stealth is not a concern.** In CTF environments and lab testing, `-A` is the standard comprehensive scan. In professional engagements, run components separately for more control.

### Traceroute

```bash
sudo nmap 10.129.2.28 --traceroute
```

Maps the network path to the target — reveals routers and network hops between the attacker and the target. Useful for understanding network topology and identifying potential pivot points.

---

## Key Takeaways — Section 2

- Six port states — Open, Closed, Filtered, Unfiltered, Open\|Filtered, Closed\|Filtered — each tells a different story about what is between you and the service
- Always save output with `-oA` — re-running long scans wastes time and creates unnecessary noise
- XML output imports directly into Metasploit — use it for seamless workflow between scanning and exploitation
- Timing templates range from T0 (paranoid/IDS evasion) to T5 (insane/noisy) — T3 is default, T4 is common for internal testing
- `--min-rate 5000` dramatically speeds up full port scans in lab environments
- OS detection (`-O`) uses TCP/IP stack fingerprinting — TTL values give quick OS hints before running a full detection
- `-A` combines version detection, OS detection, default scripts, and traceroute — maximum information, maximum noise
