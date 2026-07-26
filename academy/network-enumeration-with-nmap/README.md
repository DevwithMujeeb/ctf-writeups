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

---

## 8. Service Enumeration and Version Detection

After identifying open ports, the next step is determining exactly what application is running on each port and what version it is. This is the bridge between scanning and vulnerability identification — a port number alone tells you little; the service version tells you everything.

### Service Version Detection (`-sV`)

```bash
sudo nmap 10.129.2.28 -p- -sV
```

Nmap probes each open port with protocol-specific requests and analyses responses to identify:

- The application name (Apache, OpenSSH, vsftpd)
- The version number (Apache 2.4.49, OpenSSH 7.4)
- Additional details (OS, hostname, protocol variant)

**Controlling version detection intensity:**

```bash
# Default intensity (3)
sudo nmap 10.129.2.28 -p- -sV

# Maximum intensity — more probes, more accurate, slower
sudo nmap 10.129.2.28 -p- -sV --version-intensity 9

# Light intensity — faster, less accurate
sudo nmap 10.129.2.28 -p- -sV --version-intensity 0
```

**Stats during scan — track progress:**

```bash
sudo nmap 10.129.2.28 -p- -sV --stats-every=5s
```

**Verbose output — see results as they come in:**

```bash
sudo nmap 10.129.2.28 -p- -sV -v
```

**Everything verbose:**

```bash
sudo nmap 10.129.2.28 -p- -sV -v --stats-every=5s
```

### Why Version Detection Matters

Once you have a service version, you can:

1. Search for known CVEs: `searchsploit apache 2.4.49`
2. Search Metasploit: `msf6 > search apache 2.4.49`
3. Check NVD (nvd.nist.gov) for CVSS-scored vulnerabilities
4. Look for public PoC exploits on GitHub or Exploit-DB

A service version is a direct path to exploitation when a CVE exists.

---

## 9. Banner Grabbing

**Banner grabbing** is the process of connecting to a service and reading the information it presents on connection — the "banner." Many services announce their name, version, and sometimes OS information in their banner.

### Banner Grabbing with Nmap

```bash
sudo nmap 10.129.2.28 -p- -sV --script=banner
```

### Banner Grabbing with Netcat

```bash
nc -nv 10.129.2.28 80
# Then type:
HEAD / HTTP/1.0
# Press Enter twice
```

### Banner Grabbing with curl

```bash
curl -I http://10.129.2.28
```

### What Banners Reveal

| Service | Example Banner                       | Information                         |
| ------- | ------------------------------------ | ----------------------------------- |
| SSH     | `SSH-2.0-OpenSSH_7.4`                | Protocol version, software, version |
| HTTP    | `Server: Apache/2.4.49 (Unix)`       | Web server, version, OS             |
| FTP     | `220 vsftpd 3.0.3`                   | FTP daemon, version                 |
| SMTP    | `220 mail.example.com ESMTP Postfix` | Mail server, hostname               |

**Security relevance:** Banners that expose version information should be suppressed in production — this is a finding in itself during a pentest. `ServerTokens Prod` in Apache hides the version; SSH can be configured to return a generic banner.

### tcpdump — Packet Capture During Scanning

While Nmap scans, capturing traffic with tcpdump reveals exactly what packets are being exchanged:

```bash
# Terminal 1 — capture traffic
sudo tcpdump -i eth0 host 10.129.2.28 -w scan_capture.pcap

# Terminal 2 — run Nmap scan
sudo nmap 10.129.2.28 -p 80 -sV

# Analyse capture
wireshark scan_capture.pcap
```

This technique is used to:

- Understand exactly what Nmap sends and receives
- Verify scan results
- Debug unexpected results (filtered ports, no responses)
- Capture service banners at the raw packet level

---

## 10. Nmap Scripting Engine (NSE)

The **Nmap Scripting Engine (NSE)** is one of Nmap's most powerful features. It provides the ability to create scripts in Lua for interaction with certain services — automating a wide variety of networking tasks from service enumeration to vulnerability detection.

There are a total of **14 categories** into which NSE scripts can be divided.

### NSE Script Categories

| Category      | Description                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| **auth**      | Determines authentication credentials — attempts default or common credentials                         |
| **broadcast** | Host discovery via broadcast messages — discovers hosts not in the target range                        |
| **brute**     | Executes brute-force scripts to guess credentials for services                                         |
| **default**   | Default scripts run with `-sC` — a curated selection of safe, informative scripts                      |
| **discovery** | Evaluation and enumeration of services — retrieves accessible information                              |
| **dos**       | Scripts that test for denial-of-service vulnerabilities — use with caution                             |
| **exploit**   | Scripts that exploit known vulnerabilities in scanned services                                         |
| **external**  | Scripts that use external services and databases for additional information                            |
| **fuzzer**    | Scripts that send unexpected or random data to identify vulnerabilities                                |
| **intrusive** | Scripts that affect the target system negatively — may crash services or consume significant resources |
| **malware**   | Checks for infection of the target by malware or backdoors                                             |
| **safe**      | Defensive scripts — will not adversely affect the target                                               |
| **version**   | Extension for service version detection — used alongside `-sV`                                         |
| **vuln**      | Identifies specific known vulnerabilities in discovered services                                       |

### Running NSE Scripts

**Default scripts (`-sC`)**

```bash
sudo nmap 10.129.2.28 -sC
```

Runs all scripts in the `default` category — safe, informative, and commonly used.

**Specific script:**

```bash
sudo nmap 10.129.2.28 --script=banner
sudo nmap 10.129.2.28 --script=http-title
sudo nmap 10.129.2.28 --script=smb-vuln-ms17-010
```

**Multiple scripts:**

```bash
sudo nmap 10.129.2.28 --script=smb-enum-shares,smb-enum-users,smb-os-discovery
```

**Script category:**

```bash
sudo nmap 10.129.2.28 --script=vuln
sudo nmap 10.129.2.28 --script=discovery
sudo nmap 10.129.2.28 --script=safe
```

**Script with arguments:**

```bash
sudo nmap 10.129.2.28 --script=http-brute --script-args userdb=users.txt,passdb=passwords.txt
```

### Essential NSE Scripts by Service

**HTTP/HTTPS (80, 443, 8080)**

```bash
nmap --script=http-title,http-headers,http-methods,http-robots.txt 10.129.2.28
nmap --script=http-enum 10.129.2.28           # Directory enumeration
nmap --script=http-shellshock 10.129.2.28     # Shellshock test
```

**SMB (445)**

```bash
nmap --script=smb-vuln-ms17-010 10.129.2.28   # EternalBlue
nmap --script=smb-enum-shares,smb-enum-users 10.129.2.28
nmap --script=smb-os-discovery 10.129.2.28
```

**FTP (21)**

```bash
nmap --script=ftp-anon,ftp-bounce,ftp-syst 10.129.2.28
```

**SSH (22)**

```bash
nmap --script=ssh-auth-methods,ssh-hostkey 10.129.2.28
```

**DNS (53)**

```bash
nmap --script=dns-zone-transfer,dns-brute 10.129.2.28
```

**SNMP (161 UDP)**

```bash
nmap -sU --script=snmp-info,snmp-interfaces,snmp-processes 10.129.2.28
```

**SMTP (25)**

```bash
nmap --script=smtp-commands,smtp-enum-users 10.129.2.28
```

### Finding and Searching Scripts

```bash
# List all scripts in a category
ls /usr/share/nmap/scripts/ | grep smb

# Search script database
nmap --script-help smb-vuln-ms17-010

# Update script database after adding new scripts
sudo nmap --script-updatedb
```

---

## Key Takeaways — Section 3

- Service version detection (`-sV`) is the bridge between open ports and exploitable vulnerabilities — a port number is meaningless without the version
- `--version-intensity` controls the depth of version probing — intensity 9 for maximum accuracy, 0 for speed
- Banner grabbing reveals software and version from the service's own output — often more reliable than Nmap's fingerprinting
- Version information in service banners is a finding in itself — production systems should suppress detailed version disclosure
- NSE has 14 script categories — `default` and `safe` are non-intrusive; `exploit`, `dos`, and `intrusive` can cause damage
- Always use `-sC` (default scripts) as part of standard enumeration — it adds significant value with minimal noise
- SMB scripts (especially `smb-vuln-ms17-010`) and HTTP scripts are the highest-yield NSE scripts in most engagements

---

## 11. Firewall and IDS/IPS Evasion

One of Nmap's most valuable capabilities beyond basic scanning is its ability to evade detection by firewalls and intrusion detection/prevention systems. Understanding these techniques is essential both for offensive work — getting accurate results through security controls — and for defensive work — knowing what attackers can do to bypass your defences.

Nmap gives us many different ways to bypass firewall rules and IDS/IPS. These methods include fragmentation of packets and the use of decoys.

### Why Evasion Is Necessary

Firewalls and IDS/IPS systems can:

- Block or filter Nmap probes — causing ports to appear filtered when they are actually open
- Detect and alert on scanning activity — triggering incident response
- Block the scanner's IP address entirely after detecting a scan

Evasion techniques allow a tester to get accurate results while reducing the signature of the scan.

### Packet Fragmentation

Splitting Nmap probe packets into smaller fragments makes them harder for IDS/IPS systems to reassemble and inspect:

```bash
# Fragment packets into 8-byte chunks
sudo nmap 10.129.2.28 -f

# Specify fragment size (must be multiple of 8)
sudo nmap 10.129.2.28 --mtu 16

# Double fragmentation
sudo nmap 10.129.2.28 -ff
```

Many older IDS/IPS systems cannot reassemble fragmented packets fast enough to inspect them — the fragments pass through individually without triggering signatures.

### Decoys

Decoys make it appear that multiple hosts are scanning the target simultaneously — making it difficult to determine which IP is the real attacker:

```bash
# Use specific decoy IPs
sudo nmap 10.129.2.28 -D 10.10.10.1,10.10.10.2,10.10.10.3

# Use random decoys (RND generates random IPs)
sudo nmap 10.129.2.28 -D RND:10

# Specify attacker position in decoy list (ME)
sudo nmap 10.129.2.28 -D 10.10.10.1,10.10.10.2,ME,10.10.10.3
```

Decoys work by spoofing the source IP in packets — target logs show traffic from multiple sources, making attribution difficult.

**Important:** Decoy IPs must be alive on the network — if decoys are dead hosts, a sophisticated IDS can identify them as spoofed by noting that only one IP (the real attacker) completes the TCP handshake.

### Source Port Manipulation

Some firewalls allow traffic from trusted ports (like 53/DNS or 80/HTTP). Spoofing the source port can bypass these rules:

```bash
# Use source port 53 (DNS) to bypass firewall rules
sudo nmap 10.129.2.28 --source-port 53

# Combined with SYN scan
sudo nmap 10.129.2.28 -sS --source-port 53
```

### Spoofing Source IP and MAC

```bash
# Spoof source IP address
sudo nmap 10.129.2.28 -S 10.10.10.200

# Spoof MAC address
sudo nmap 10.129.2.28 --spoof-mac 0
```

**Note:** IP spoofing means you will not receive responses — only useful when combined with sniffing on the same network segment or when responses are not needed (e.g. SYN floods for DoS testing).

### Idle/Zombie Scan (`-sI`)

The most stealthy scan type — uses a third-party "zombie" host to send probes. The attacker never sends packets directly to the target:

```bash
sudo nmap 10.129.2.28 -sI <zombie host IP>
```

The zombie must be idle (generating minimal traffic) and use predictable IP ID incrementation.

### Slow and Low Scans

Reducing scan speed to blend into normal network noise:

```bash
# Paranoid timing — one probe every 5 minutes
sudo nmap 10.129.2.28 -T0

# Random scan order — avoids sequential port scanning signatures
sudo nmap 10.129.2.28 --randomize-hosts

# Insert random delays between probes
sudo nmap 10.129.2.28 --scan-delay 5s
```

### DNS Evasion

```bash
# Use a specific DNS server for resolution
sudo nmap 10.129.2.28 --dns-servers 8.8.8.8

# Disable reverse DNS lookup (reduces noise)
sudo nmap 10.129.2.28 -n
```

### Combining Evasion Techniques

In a professional engagement against a hardened target:

```bash
sudo nmap 10.129.2.28 \
  -sS \
  -p 80,443,22,445 \
  -T1 \
  -f \
  -D RND:5 \
  --source-port 53 \
  -n \
  --scan-delay 2s \
  -oA evasive_scan
```

This combines: SYN scan, specific ports, slow timing, fragmentation, 5 random decoys, source port spoofing, no DNS resolution, and scan delay.

---

## 12. Scanning Through Proxies and Pivoting

Once inside a network through a compromised host, Nmap can be used to scan internal segments that are not directly reachable:

```bash
# Route Nmap through a SOCKS proxy
proxychains nmap -sT -Pn 192.168.1.0/24

# Note: proxychains only works with TCP connect scans (-sT)
# SYN scans require raw socket access which proxychains cannot proxy
```

**Port forwarding for specific services:**

```bash
# Forward remote port to local for direct tool access
ssh -L 8080:192.168.1.10:80 user@<pivot host>
```

---

## Key Takeaways — Section 4

- Firewalls and IDS/IPS can filter, block, or alert on Nmap scans — evasion techniques get accurate results through security controls
- Packet fragmentation splits probes into smaller chunks — older IDS systems cannot reassemble them fast enough to inspect
- Decoys flood target logs with multiple source IPs — attribution becomes difficult, but decoys must be alive hosts
- Source port spoofing (`--source-port 53`) bypasses firewall rules that allow DNS traffic
- The idle/zombie scan is the most stealthy technique — the attacker's IP never appears in target logs
- Slow timing (`-T0`, `--scan-delay`) blends scan traffic into normal network noise
- Evasion techniques are cumulative — combining fragmentation, decoys, slow timing, and source port spoofing is more effective than any single technique
- `proxychains nmap` enables scanning of internal networks through a compromised pivot host — TCP connect scans only
