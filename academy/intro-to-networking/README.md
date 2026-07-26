# Introduction To Networking — HackTheBox Academy

**Module:** Introduction To Networking
**Platform:** HackTheBox Academy
**Path:** Junior Cybersecurity Analyst (CJCA)
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Introduction To Networking builds on the conceptual groundwork of Network Foundations and goes deeper — covering the specific protocols, services, and technologies that make modern networks function. Where Network Foundations answered "what is a network?", this module answers "how does a network actually work at the protocol level?" and critically, "where does each protocol fail?"

For a security engineer, protocols are not just technical specifications — they are attack surfaces defined in RFC documents. Every protocol has assumptions. Every assumption is a potential vulnerability.

---

## 1. Networking Key Terminology

Before going deep on protocols, the terminology needs to be solid. These are the foundational terms and acronyms that appear constantly in networking and security contexts.

### Core Protocol Acronyms

| Acronym   | Full Name                                  | Purpose                                                           |
| --------- | ------------------------------------------ | ----------------------------------------------------------------- |
| **WEP**   | Wired Equivalent Privacy                   | Legacy wireless security protocol — broken, never use             |
| **SSH**   | Secure Shell                               | Encrypted remote access to systems, port 22                       |
| **FTP**   | File Transfer Protocol                     | File transfer between client and server, ports 20/21              |
| **SMTP**  | Simple Mail Transfer Protocol              | Sending email, port 25                                            |
| **HTTP**  | HyperText Transfer Protocol                | Web communication, port 80                                        |
| **HTTPS** | HTTP Secure                                | Encrypted web communication via TLS, port 443                     |
| **SMB**   | Server Message Block                       | Windows file and printer sharing, port 445                        |
| **NFS**   | Network File System                        | Unix/Linux file sharing over a network                            |
| **SNMP**  | Simple Network Management Protocol         | Network device monitoring and management                          |
| **WPA**   | Wi-Fi Protected Access                     | Wireless security protocol (WPA2/WPA3 are current)                |
| **TKIP**  | Temporal Key Integrity Protocol            | Encryption protocol used in WPA — now deprecated                  |
| **NTP**   | Network Time Protocol                      | Synchronizes clocks across network devices, port 123              |
| **VLAN**  | Virtual Local Area Network                 | Logical network segmentation within a physical switch             |
| **VTP**   | VLAN Trunking Protocol                     | Manages VLAN configurations across Cisco switches                 |
| **RIP**   | Routing Information Protocol               | Distance-vector routing protocol — older, limited to 15 hops      |
| **OSPF**  | Open Shortest Path First                   | Link-state routing protocol — used in enterprise networks         |
| **IGRP**  | Interior Gateway Routing Protocol          | Cisco proprietary distance-vector routing protocol (legacy)       |
| **EIGRP** | Enhanced Interior Gateway Routing Protocol | Advanced Cisco routing protocol, successor to IGRP                |
| **PGP**   | Pretty Good Privacy                        | Encryption program for emails and files                           |
| **NNTP**  | Network News Transfer Protocol             | Used for Usenet newsgroup communication                           |
| **CDP**   | Cisco Discovery Protocol                   | Cisco proprietary protocol for discovering adjacent Cisco devices |
| **VoIP**  | Voice Over IP                              | Voice communication transmitted over IP networks                  |
| **SIP**   | Session Initiation Protocol                | Signalling protocol for VoIP sessions                             |
| **IPsec** | Internet Protocol Security                 | Protocol suite for encrypting IP communications                   |
| **CRLF**  | Carriage Return Line Feed                  | Line ending sequence (`\r\n`) in HTTP and other protocols         |

### Why Terminology Matters for Security

Knowing these acronyms is not just vocabulary — each one represents a service that may be running on a target machine. During reconnaissance, identifying which protocols and services are active directly shapes the attack path:

- **SMB (445)** open → potential for EternalBlue, pass-the-hash, relay attacks
- **SNMP** running → community strings may expose device configuration
- **FTP (21)** open → anonymous login, cleartext credentials, file exfiltration
- **NTP (123)** → NTP amplification attacks in DDoS campaigns
- **CDP** running → network topology disclosure to anyone on the segment

---

## 2. Network Models — A Deeper Look

### The OSI Model Revisited

The OSI model was covered in Network Foundations. Introduction To Networking reinforces it with a focus on how real protocols map to each layer and how data changes form as it moves through the stack.

**Data unit names per layer:**

| Layer            | Data Unit                      | Example                           |
| ---------------- | ------------------------------ | --------------------------------- |
| 7 — Application  | Data                           | HTTP request                      |
| 6 — Presentation | Data                           | Encrypted/formatted data          |
| 5 — Session      | Data                           | Session-managed data              |
| 4 — Transport    | Segment (TCP) / Datagram (UDP) | TCP segment with port headers     |
| 3 — Network      | Packet                         | IP packet with source/dest IP     |
| 2 — Data Link    | Frame                          | Ethernet frame with MAC addresses |
| 1 — Physical     | Bits                           | Raw electrical/optical signals    |

**Encapsulation** — as data travels down the stack from Layer 7 to Layer 1, each layer wraps the data with its own header (and sometimes trailer). This is called encapsulation.

**Decapsulation** — at the receiving end, the process reverses. Each layer strips its header and passes the payload up to the next layer.

**Security relevance:** Deep Packet Inspection (DPI) — used by firewalls and IDS/IPS — inspects headers at multiple layers simultaneously to detect anomalies. Protocol anomalies (e.g. HTTP traffic on port 443 that doesn't look like HTTPS) can indicate tunnelling or evasion.

### The TCP/IP Model in Practice

The TCP/IP model condenses OSI into 4 layers and is what real implementations use:

```
Application Layer  →  HTTP, HTTPS, FTP, SSH, DNS, SMTP, SNMP, NTP
Transport Layer    →  TCP, UDP
Internet Layer     →  IP, ICMP, ARP
Network Access     →  Ethernet, Wi-Fi (802.11), MAC
```

Every tool in a pentester's toolkit operates at one or more of these layers. Understanding which layer a tool touches tells you what it can see and what it can manipulate.

---

## Key Takeaways — Section 1

- Networking terminology is the shared language of both networking and security — every acronym is a potential service running on a target
- SMB, FTP, SNMP, and CDP are high-value targets during recon — each has well-known attack vectors
- Data changes form (data → segment → packet → frame → bits) as it moves down the OSI stack through encapsulation
- Decapsulation reverses the process at the receiver — each layer reads its header and strips it before passing up
- The TCP/IP model is the practical implementation — 4 layers covering what OSI splits into 7

---

## 3. TCP — Transmission Control Protocol

TCP is a **connection-oriented protocol** that establishes a virtual connection between two devices before any data is transmitted. It guarantees reliable, ordered, and error-checked delivery of data.

### The Three-Way Handshake

Every TCP connection begins with a three-way handshake:

```
Client                    Server
  |                          |
  |-------- SYN ----------->|   Client requests connection
  |                          |
  |<------ SYN-ACK ---------|   Server acknowledges and responds
  |                          |
  |-------- ACK ----------->|   Client confirms
  |                          |
  |    [Connection Open]     |
```

After the handshake, data transfer begins. When the session ends, a **four-way termination** occurs (FIN → ACK → FIN → ACK).

### TCP Header Fields

Key fields in a TCP header that matter for security:

| Field                  | Size    | Purpose                                  |
| ---------------------- | ------- | ---------------------------------------- |
| Source Port            | 16 bits | Originating port                         |
| Destination Port       | 16 bits | Target port                              |
| Sequence Number        | 32 bits | Tracks byte ordering                     |
| Acknowledgement Number | 32 bits | Next expected byte                       |
| Flags                  | 9 bits  | SYN, ACK, FIN, RST, PSH, URG             |
| Window Size            | 16 bits | Flow control — how much data can be sent |
| Checksum               | 16 bits | Error detection                          |

### TCP Flags

TCP flags control the state of a connection. Each is a single bit — set (1) or unset (0):

| Flag    | Name        | Purpose                                                |
| ------- | ----------- | ------------------------------------------------------ |
| **SYN** | Synchronize | Initiates a connection                                 |
| **ACK** | Acknowledge | Confirms receipt                                       |
| **FIN** | Finish      | Gracefully closes a connection                         |
| **RST** | Reset       | Abruptly terminates a connection                       |
| **PSH** | Push        | Tells receiver to pass data to application immediately |
| **URG** | Urgent      | Marks data as urgent                                   |

**Security relevance:** Nmap uses TCP flags to perform different scan types:

- **SYN scan (`-sS`)** — sends SYN, never completes the handshake. Stealthy — no full connection logged
- **Connect scan (`-sT`)** — completes the full handshake. Louder but works without root privileges
- **FIN/NULL/XMAS scans** — send unusual flag combinations to probe firewall behaviour
- **RST packets** — a RST response to a SYN means the port is closed; no response may mean filtered

### TCP Reliability Mechanisms

- **Sequence numbers** — ensure data is reassembled in the correct order even if packets arrive out of sequence
- **Acknowledgements** — receiver confirms each segment; sender retransmits if no ACK received within timeout
- **Flow control** — window size prevents the sender from overwhelming the receiver
- **Congestion control** — TCP slows transmission when network congestion is detected

**Attack relevance:** TCP sequence number prediction was historically used for **session hijacking** — guessing the next sequence number to inject data into an established connection. Modern OS implementations use randomised initial sequence numbers (ISN) to prevent this.

---

## 4. UDP — User Datagram Protocol

UDP is a **connectionless protocol** — it sends data packets to the destination without establishing a connection first and without checking whether they were received.

```
Client                    Server
  |                          |
  |-------- Data ----------->|   Sent. No handshake. No confirmation.
  |                          |
```

### TCP vs UDP — Full Comparison

| Feature        | TCP                     | UDP                      |
| -------------- | ----------------------- | ------------------------ |
| Connection     | Connection-oriented     | Connectionless           |
| Reliability    | Guaranteed delivery     | No guarantee             |
| Ordering       | Ordered                 | Unordered                |
| Error checking | Yes (retransmission)    | Checksum only            |
| Speed          | Slower                  | Faster                   |
| Header size    | 20–60 bytes             | 8 bytes                  |
| Use cases      | HTTP/S, SSH, FTP, email | DNS, VoIP, video, gaming |

### When UDP Is the Right Choice

UDP is chosen when speed matters more than reliability:

- **DNS** — a single request/response; retrying is faster than establishing a TCP connection
- **VoIP** — a dropped packet in a phone call is better than a delayed one
- **Video streaming** — minor packet loss is acceptable; buffering is not
- **Online gaming** — low latency is critical; reliability is handled at the application layer

### Security Relevance of UDP

- **UDP port scanning** — harder than TCP scanning. Closed UDP ports return ICMP "port unreachable"; open ports often return nothing, making results ambiguous
- **UDP amplification attacks** — attacker sends small UDP requests with a spoofed source IP (victim's IP) to servers that return large responses (DNS, NTP, SSDP). The victim receives massive traffic they never requested
- **DNS over UDP** — DNS queries use UDP by default (port 53). DNS poisoning exploits the lack of authentication in UDP-based DNS responses

---

## 5. ICMP — Internet Control Message Protocol

**ICMP** is a protocol used by network devices to communicate error reporting and status information. It operates at Layer 3 (Network layer) and is used by routers and hosts to send diagnostic and control messages.

ICMP does not carry application data — it carries messages about the network itself.

### Common ICMP Message Types

| Type | Code | Message                 | Meaning                                        |
| ---- | ---- | ----------------------- | ---------------------------------------------- |
| 0    | 0    | Echo Reply              | Response to a ping                             |
| 3    | 0–15 | Destination Unreachable | Packet could not be delivered                  |
| 3    | 1    | Host Unreachable        | Target host not reachable                      |
| 3    | 3    | Port Unreachable        | UDP port closed (used by UDP scan results)     |
| 5    | 0    | Redirect                | Router telling host to use a different gateway |
| 8    | 0    | Echo Request            | Ping — are you there?                          |
| 11   | 0    | Time Exceeded           | TTL expired in transit (used by traceroute)    |

### ping

`ping` uses ICMP Echo Request (Type 8) and Echo Reply (Type 0) to test reachability:

```bash
ping -c 4 <target IP>
```

**TTL (Time To Live)** in the reply reveals OS hints:

- Linux/Unix default TTL: **64**
- Windows default TTL: **128**
- Cisco network devices: **255**

Each router hop decrements TTL by 1. If TTL reaches 0, the packet is discarded and an ICMP Time Exceeded message is sent back — this is how `traceroute` works.

### traceroute

`traceroute` sends packets with incrementally increasing TTL values, forcing each router along the path to send back ICMP Time Exceeded messages — revealing the full path to the destination:

```bash
traceroute <target IP>          # Linux
tracert <target IP>             # Windows
```

### Security Relevance of ICMP

- **ICMP sweep (ping sweep)** — sending Echo Requests to a range of IPs to discover live hosts. Nmap: `nmap -sn 192.168.1.0/24`
- **ICMP blocking** — many firewalls block ICMP. A host not responding to ping doesn't mean it's down — it may be filtering ICMP. Always combine ping sweeps with TCP/UDP scans
- **ICMP tunnelling** — encodes data inside ICMP packets to exfiltrate data or bypass firewalls that only filter TCP/UDP
- **ICMP redirect attacks** — forged ICMP redirect messages can manipulate routing tables on hosts, redirecting traffic through an attacker-controlled gateway

---

## Key Takeaways — Section 2

- TCP is reliable and connection-oriented — the three-way handshake (SYN → SYN-ACK → ACK) establishes every connection
- TCP flags (SYN, ACK, FIN, RST) control connection state — Nmap exploits these for different scan types
- UDP is fast and connectionless — no handshake, no acknowledgement, no ordering guarantee
- UDP amplification attacks use the connectionless nature of UDP to flood victims with reflected traffic
- ICMP carries network control messages, not application data — ping and traceroute are built on it
- TTL values in ICMP replies hint at the OS — 64 is Linux, 128 is Windows
- ICMP blocking is common — a non-responsive host is not necessarily down; always use multiple discovery methods
- ICMP tunnelling is a real exfiltration and C2 technique — encrypted traffic in ICMP is harder to detect

---

## 6. FTP — File Transfer Protocol

**FTP** is one of the oldest network protocols still in widespread use. It transfers files between a client and server over TCP using two separate channels:

- **Port 21** — Control channel: commands and responses (USER, PASS, LIST, RETR, STOR)
- **Port 20** — Data channel: actual file transfer

### FTP Modes

**Active Mode:**

1. Client connects to server on port 21 (control)
2. Client tells server which port it is listening on
3. Server initiates data connection FROM port 20 TO client's specified port

- Problem: firewalls on the client side often block incoming connections

**Passive Mode:**

1. Client connects to server on port 21 (control)
2. Client sends PASV command
3. Server opens a random high port and tells client which one
4. Client initiates the data connection to that port

- Solves the firewall problem — all connections initiated by client

### FTP Security Issues

FTP transmits everything in **cleartext** — username, password, and file contents are all readable by anyone on the network path.

**Anonymous FTP** — many FTP servers allow login with username `anonymous` and any password (or blank). Anonymous access is a common misconfiguration that exposes files publicly.

```bash
ftp <target IP>
# At prompt:
Username: anonymous
Password: (blank or any email)
```

**Key FTP commands:**

```bash
ls          # list directory
cd          # change directory
get <file>  # download file
put <file>  # upload file
binary      # switch to binary transfer mode
bye         # exit
```

**Security relevance:**

- FTP credentials sent in cleartext — capturable with Wireshark or tcpdump on the same network
- Anonymous login → read/write access to files without credentials
- Writable FTP directories → potential for uploading webshells if the FTP root overlaps with the web root
- **FTPS** (FTP over SSL) and **SFTP** (SSH File Transfer Protocol) are the secure alternatives — SFTP is preferred as it runs over SSH on port 22

---

## 7. HTTP — HyperText Transfer Protocol

HTTP is the foundation of data communication on the web. Every web page, API call, and web application interaction uses HTTP (or its encrypted version, HTTPS).

### HTTP Request Structure

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Connection: keep-alive
```

Components:

- **Method** — what action to perform (GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH)
- **Path** — the resource being requested (`/index.html`)
- **HTTP Version** — `HTTP/1.1` or `HTTP/2`
- **Headers** — metadata about the request
- **Body** — data sent with POST/PUT requests

### HTTP Methods

| Method      | Purpose                      | Idempotent | Safe |
| ----------- | ---------------------------- | ---------- | ---- |
| **GET**     | Retrieve a resource          | Yes        | Yes  |
| **POST**    | Submit data, create resource | No         | No   |
| **PUT**     | Create or replace a resource | Yes        | No   |
| **DELETE**  | Remove a resource            | Yes        | No   |
| **HEAD**    | GET without response body    | Yes        | Yes  |
| **OPTIONS** | List allowed methods         | Yes        | Yes  |
| **PATCH**   | Partially update a resource  | No         | No   |

### HTTP Response Structure

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Server: Apache/2.4.41

<html>...</html>
```

### HTTP Headers — Security Relevant

**Request headers attackers look for:**

- `Authorization` — credentials, JWT tokens
- `Cookie` — session tokens
- `X-Forwarded-For` — real IP behind a proxy; can be spoofed
- `Referer` — reveals where a request came from

**Response headers defenders should set:**
| Header | Purpose |
|--------|---------|
| `Strict-Transport-Security` | Forces HTTPS |
| `Content-Security-Policy` | Restricts resources the browser can load (XSS mitigation) |
| `X-Frame-Options` | Prevents clickjacking |
| `X-Content-Type-Options` | Prevents MIME sniffing |
| `Referrer-Policy` | Controls Referer header leakage |
| `Permissions-Policy` | Restricts browser features |

### HTTPS

**HTTPS** = HTTP + TLS (Transport Layer Security). TLS encrypts the HTTP traffic so it cannot be read in transit.

TLS handshake establishes:

1. Which TLS version and cipher suite to use
2. Server identity verification via certificate
3. Symmetric encryption key exchange

**Security relevance of HTTP/HTTPS:**

- HTTP sends everything in cleartext — session cookies, credentials, all content interceptable
- Missing security headers are low-effort findings in web assessments
- HTTP methods like PUT and DELETE enabled on a web server can allow unauthorized file upload or deletion
- `OPTIONS` method revealing unexpected methods (PUT, DELETE, TRACE) indicates misconfiguration
- `TRACE` method enabled → Cross-Site Tracing (XST) attack possible

---

## 8. SMB — Server Message Block

**SMB** is a network communication protocol used primarily for providing shared access to files, printers, and serial ports between nodes on a network. It operates over TCP port 445 (and legacy NetBIOS ports 137–139).

SMB is one of the most targeted protocols in internal network penetration testing — it is the backbone of Windows file sharing and has a long history of critical vulnerabilities.

### SMB Versions

| Version | OS                 | Notes                                                       |
| ------- | ------------------ | ----------------------------------------------------------- |
| SMBv1   | Windows XP/2003    | Legacy, insecure — **EternalBlue (MS17-010) exploits this** |
| SMBv2   | Windows Vista/2008 | Improved performance and security                           |
| SMBv3   | Windows 8/2012+    | Added encryption support                                    |

### SMB Security Issues

**EternalBlue (MS17-010)** — a critical vulnerability in SMBv1 that allowed unauthenticated remote code execution. Exploited by WannaCry ransomware in 2017, affecting hundreds of thousands of systems globally. The exploit is still publicly available in Metasploit (`exploit/windows/smb/ms17_010_eternalblue`).

**Null sessions** — older SMB configurations allow unauthenticated connections that can enumerate users, shares, and system information.

**Pass-the-Hash** — SMB authentication uses NTLM hashes. An attacker who captures an NTLM hash (via Responder, for example) can use it directly to authenticate without knowing the plaintext password.

**SMB Relay** — instead of cracking captured NTLM hashes, relay them to another machine that trusts the victim — potentially gaining access without any cracking.

**Common SMB enumeration:**

```bash
# List shares without credentials
smbclient -L //<target IP> -N

# Connect to a share
smbclient //<target IP>/ShareName -N

# Enumerate with enum4linux
enum4linux -a <target IP>

# Nmap SMB scripts
nmap --script smb-enum-shares,smb-enum-users <target IP>
```

---

## 9. SSH — Secure Shell

**SSH** provides encrypted remote access to systems over an insecure network. It replaced Telnet (which sent everything in cleartext) as the standard for remote administration. Runs on TCP port 22.

### SSH Authentication Methods

| Method                   | Description            | Security                                        |
| ------------------------ | ---------------------- | ----------------------------------------------- |
| **Password**             | Username + password    | Vulnerable to brute force                       |
| **Public Key**           | Cryptographic key pair | Strongest — private key never leaves the client |
| **Keyboard-Interactive** | Challenge-response     | Used for MFA                                    |
| **Certificate**          | SSH certificates       | Enterprise environments                         |

### SSH Key Authentication

```bash
# Generate a key pair
ssh-keygen -t ed25519 -C "your@email.com"

# Copy public key to server
ssh-copy-id user@<target IP>

# Connect using key
ssh -i ~/.ssh/id_ed25519 user@<target IP>
```

The **public key** goes on the server (`~/.ssh/authorized_keys`). The **private key** never leaves your machine.

### SSH Security Relevance

- **SSH brute forcing** — port 22 open to the internet is constantly scanned and brute-forced. Tools: `hydra`, `medusa`
- **Default credentials** — many devices ship with SSH enabled and default credentials (root/root, admin/admin)
- **Old SSH versions** — outdated OpenSSH versions have known CVEs
- **SSH tunnelling / port forwarding** — SSH can forward ports, creating encrypted tunnels through firewalls:

  ```bash
  # Local port forward — access remote service locally
  ssh -L 8080:localhost:80 user@<target IP>

  # Dynamic SOCKS proxy — route all traffic through SSH
  ssh -D 1080 user@<target IP>
  ```

  Attackers use SSH tunnelling to pivot through compromised hosts and reach otherwise unreachable internal services

---

## Key Takeaways — Section 3

- FTP uses two channels (control port 21, data port 20) and transmits everything in cleartext — always check for anonymous login
- SFTP over SSH port 22 is the secure replacement for FTP — never use plain FTP where SFTP is available
- HTTP headers are a two-sided security surface — request headers leak information, response headers enforce browser security policies
- HTTPS encrypts HTTP traffic with TLS — missing HSTS means users can be downgraded to HTTP
- SMB port 445 is one of the highest-value targets in internal network pentesting — EternalBlue, Pass-the-Hash, and SMB relay are all critical attack vectors
- SMBv1 should be disabled everywhere — if it is enabled, EternalBlue is the first thing to check
- SSH replaced Telnet — password auth is vulnerable to brute force, key-based auth is the standard
- SSH tunnelling enables port forwarding and SOCKS proxying — used by attackers for pivoting through internal networks
