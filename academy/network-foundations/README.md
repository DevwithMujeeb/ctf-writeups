# Network Foundations — HackTheBox Academy

**Module:** Network Foundations
**Platform:** HackTheBox Academy
**Path:** Junior Cybersecurity Analyst (CJCA)
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Network Foundations covers how computer networks are structured, how devices communicate, and what protocols govern that communication. Coming from a development background where networking was always abstracted away, this module forced a ground-up understanding of what actually happens when data moves from one machine to another — and where an attacker can intercept, manipulate, or disrupt that movement.

Understanding networks is not optional for security. Every attack crosses a network. Every defence lives on one.

---

## 1. What Is a Network?

A **network** is two or more computers connected together to share resources and communicate. Networks range from two devices connected at home to millions of devices spanning the globe.

**Key network types:**

| Type     | Full Name                 | Description                                                                                                            |
| -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **LAN**  | Local Area Network        | Covers a small area — home, office, building. Devices are close together and typically connected via Ethernet or Wi-Fi |
| **WAN**  | Wide Area Network         | Covers large geographic areas — cities, countries, the internet. Connects multiple LANs together                       |
| **MAN**  | Metropolitan Area Network | Covers a city or campus — larger than LAN, smaller than WAN                                                            |
| **PAN**  | Personal Area Network     | Very short range — Bluetooth between phone and laptop                                                                  |
| **WLAN** | Wireless LAN              | LAN using wireless communication instead of physical cables                                                            |

**Why networks matter for security:** Every network is an attack surface. Devices on the same LAN can communicate directly — if an attacker gains access to a network, they can potentially reach every device on it. Understanding network scope and segmentation is fundamental to understanding what an attacker can access after initial compromise.

---

## 2. The OSI Model

The **OSI (Open Systems Interconnection) Model** is a conceptual framework that standardizes how different network systems communicate with each other. It breaks communication down into **7 layers**, each with a specific responsibility.

| Layer | Name             | Function                                                            | Example Protocols/Devices   |
| ----- | ---------------- | ------------------------------------------------------------------- | --------------------------- |
| 7     | **Application**  | Interface between the network and the end-user application          | HTTP, HTTPS, FTP, DNS, SMTP |
| 6     | **Presentation** | Data formatting, encryption, compression                            | SSL/TLS, JPEG, ASCII        |
| 5     | **Session**      | Establishes, manages, and terminates sessions between applications  | NetBIOS, RPC                |
| 4     | **Transport**    | End-to-end communication, error checking, flow control              | TCP, UDP                    |
| 3     | **Network**      | Logical addressing and routing between networks                     | IP, ICMP, routers           |
| 2     | **Data Link**    | Physical addressing (MAC), error detection within a network segment | Ethernet, Wi-Fi, switches   |
| 1     | **Physical**     | Raw bit transmission over physical medium                           | Cables, hubs, NICs          |

**How to remember the layers (top to bottom):** All People Seem To Need Data Processing.

**Security relevance per layer:**

- **Layer 7** — Application layer attacks: SQL injection, XSS, CSRF, HTTP exploits
- **Layer 6** — SSL/TLS vulnerabilities, weak encryption
- **Layer 5** — Session hijacking
- **Layer 4** — Port scanning, SYN floods, firewall rules operate here
- **Layer 3** — IP spoofing, routing attacks, ICMP-based attacks
- **Layer 2** — ARP poisoning, MAC spoofing, VLAN hopping
- **Layer 1** — Physical access attacks, cable tapping

The OSI model is the map. Penetration testers work through it systematically — understanding which layer a vulnerability lives on determines which tools and techniques apply.

---

## 3. The TCP/IP Model

The **TCP/IP model** is the practical implementation of the OSI model — it is what the internet actually runs on. It condenses the 7 OSI layers into 4 layers.

| TCP/IP Layer       | Corresponds to OSI Layers | Protocols                        |
| ------------------ | ------------------------- | -------------------------------- |
| **Application**    | OSI 5, 6, 7               | HTTP, HTTPS, FTP, DNS, SMTP, SSH |
| **Transport**      | OSI 4                     | TCP, UDP                         |
| **Internet**       | OSI 3                     | IP, ICMP, ARP                    |
| **Network Access** | OSI 1, 2                  | Ethernet, Wi-Fi, MAC             |

### TCP vs UDP

The two core transport protocols have fundamentally different characteristics and use cases:

**TCP (Transmission Control Protocol)**

- Connection-oriented — establishes a connection before data transfer via the **three-way handshake**
- Reliable — guarantees delivery, ordering, and error checking
- Slower due to overhead
- Used where accuracy matters: HTTP/S, SSH, FTP, email

**TCP Three-Way Handshake:**

```
Client → Server: SYN
Server → Client: SYN-ACK
Client → Server: ACK
[Connection established]
```

**UDP (User Datagram Protocol)**

- Connectionless — sends data without establishing a connection first
- Unreliable — no guarantee of delivery or ordering
- Faster due to low overhead
- Used where speed matters more than accuracy: DNS, VoIP, video streaming, gaming

**Security relevance:**

- The TCP three-way handshake is exploited in **SYN flood attacks** — an attacker sends SYN packets without completing the handshake, exhausting server resources
- UDP's lack of connection state makes it useful for **amplification attacks** — small requests generate large responses that are sent to a spoofed victim IP
- Port scanners like Nmap exploit TCP and UDP behaviour to discover open services

---

## Key Takeaways — Section 1

- Networks connect devices to share resources — LANs are local, WANs span distances, the internet is the largest WAN
- The OSI model has 7 layers — each layer is a distinct attack surface with its own vulnerability classes
- The TCP/IP model is what networks actually use — 4 layers mapping to OSI's 7
- TCP is reliable and connection-oriented — UDP is fast and connectionless
- The TCP three-way handshake (SYN → SYN-ACK → ACK) is the foundation of every TCP connection — and a target for denial-of-service attacks
- Every layer of the OSI model has associated attacks — security thinking requires understanding all layers, not just the application layer
