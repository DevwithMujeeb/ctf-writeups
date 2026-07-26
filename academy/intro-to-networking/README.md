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
