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

---

## 4. IP Addressing

Every device on a network needs an address so data knows where to go. An **IP address** is a numerical label assigned to each device connected to a network that uses the Internet Protocol for communication.

### IPv4

**IPv4** addresses are **32-bit** numbers written in dotted decimal format — four groups of numbers separated by dots, each ranging from 0 to 255.

Example: `192.168.1.105`

Each group is called an **octet** (8 bits). Four octets × 8 bits = 32 bits total.

IPv4 provides approximately 4.3 billion unique addresses — a number that has been exhausted due to the explosion of internet-connected devices.

### IPv6

**IPv6** addresses are **128-bit** numbers written as eight groups of four hexadecimal digits separated by colons.

Example: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

IPv6 provides 340 undecillion addresses — effectively unlimited for all practical purposes.

**Key difference:**

|               | IPv4            | IPv6             |
| ------------- | --------------- | ---------------- |
| Size          | 32-bit          | 128-bit          |
| Format        | Decimal (0–255) | Hexadecimal      |
| Example       | `192.168.1.1`   | `2001:db8::1`    |
| Address space | ~4.3 billion    | ~340 undecillion |

### IP Address Classes (IPv4)

IPv4 addresses are divided into classes based on their range:

| Class | Range                       | Default Use           |
| ----- | --------------------------- | --------------------- |
| A     | 1.0.0.0 – 126.255.255.255   | Large networks        |
| B     | 128.0.0.0 – 191.255.255.255 | Medium networks       |
| C     | 192.0.0.0 – 223.255.255.255 | Small networks        |
| D     | 224.0.0.0 – 239.255.255.255 | Multicast             |
| E     | 240.0.0.0 – 255.255.255.255 | Reserved/experimental |

### Private vs Public IP Addresses

Not all IP addresses are routable on the internet. **Private addresses** are reserved for use within internal networks and are not reachable from the public internet.

| Range                           | Class | Common Use        |
| ------------------------------- | ----- | ----------------- |
| `10.0.0.0 – 10.255.255.255`     | A     | Large enterprises |
| `172.16.0.0 – 172.31.255.255`   | B     | Medium networks   |
| `192.168.0.0 – 192.168.255.255` | C     | Home/small office |

**Security relevance:** During reconnaissance, identifying whether a target uses private addressing reveals internal network structure. RFC 1918 private ranges appearing in public-facing responses (error messages, headers) leak internal topology.

### Subnetting

**Subnetting** is the process of dividing a larger network into smaller sub-networks (subnets). It improves network efficiency and — critically for security — provides **segmentation**.

A **subnet mask** defines which portion of an IP address identifies the network and which identifies the host:

- IP address: `192.168.1.105`
- Subnet mask: `255.255.255.0`
- Network portion: `192.168.1`
- Host portion: `.105`

**CIDR notation** expresses the subnet mask as a prefix length — the number of bits used for the network portion:

`192.168.1.0/24` means the first 24 bits are the network (255.255.255.0), leaving 8 bits for hosts = 256 addresses (254 usable).

Common CIDR ranges:

| CIDR | Subnet Mask     | Usable Hosts |
| ---- | --------------- | ------------ |
| /8   | 255.0.0.0       | 16,777,214   |
| /16  | 255.255.0.0     | 65,534       |
| /24  | 255.255.255.0   | 254          |
| /30  | 255.255.255.252 | 2            |

**Security relevance:** Subnetting is used defensively to segment networks — isolating databases from web servers, separating guest Wi-Fi from internal systems. During a penetration test, identifying the subnet scope tells you how many hosts to scan and what lateral movement paths exist.

---

## 5. MAC Addresses

An **IP address** identifies a device on a network logically. A **MAC (Media Access Control) address** identifies it physically — at the hardware level.

Every Network Interface Card (NIC) has a MAC address burned in by the manufacturer. It is used for communication within a local network segment (Layer 2).

**Format:** 48 bits, written as 6 pairs of hexadecimal digits:

```
AA:BB:CC:DD:EE:FF
```

**Structure:**

- First 24 bits — **OUI (Organizationally Unique Identifier)** — assigned to the manufacturer (e.g. `00:1A:2B` = Cisco)
- Last 24 bits — **Device identifier** — unique to the individual NIC

**MAC vs IP:**

|             | MAC Address           | IP Address        |
| ----------- | --------------------- | ----------------- |
| Layer       | Layer 2 (Data Link)   | Layer 3 (Network) |
| Scope       | Local network segment | Entire internet   |
| Assigned by | Manufacturer          | Network/admin     |
| Changes?    | No (burned in)        | Yes (DHCP)        |

**Security relevance:**

- **MAC spoofing** — attackers can change their MAC address in software to impersonate another device or bypass MAC-based access controls
- **OUI lookup** — during recon, looking up the OUI of a discovered MAC address reveals the device manufacturer, which can hint at the OS or device type
- MAC addresses are visible in ARP tables — `arp -a` reveals MAC-to-IP mappings on the local network

---

## Key Takeaways — Section 2

- IPv4 is 32-bit (dotted decimal), IPv6 is 128-bit (hexadecimal) — IPv4 address space is exhausted, IPv6 is the long-term solution
- Private IP ranges (10.x, 172.16–31.x, 192.168.x) are not routable on the internet — they appear in internal networks
- Subnetting divides networks into segments — CIDR /24 gives 254 usable hosts, /30 gives 2
- Segmentation via subnetting is a core network security control — it limits lateral movement after compromise
- MAC addresses operate at Layer 2 and identify hardware — the first 24 bits identify the manufacturer (OUI)
- MAC spoofing is trivial — MAC-based access control alone is not a reliable security control
- During recon: subnet scope determines scan range, OUI lookup reveals device type, private IPs in public responses leak internal topology

---

## 6. ARP — Address Resolution Protocol

When a device wants to send data to another device on the same local network, it knows the destination IP address but needs the MAC address to actually deliver the frame at Layer 2. **ARP** solves this problem — it maps IP addresses to MAC addresses within a local network segment.

### How ARP Works

1. Device A wants to communicate with `192.168.1.10` but doesn't know its MAC address
2. Device A broadcasts an **ARP Request** to the entire network: _"Who has 192.168.1.10? Tell 192.168.1.1"_
3. The device with IP `192.168.1.10` responds with an **ARP Reply**: _"192.168.1.10 is at AA:BB:CC:DD:EE:FF"_
4. Device A stores this mapping in its **ARP cache** for future use
5. Communication proceeds using the MAC address

**ARP cache** — devices store recent ARP mappings locally to avoid broadcasting for every packet. View it with:

```bash
arp -a
```

### ARP Poisoning / ARP Spoofing

ARP has no authentication — any device can send an ARP reply claiming to be any IP address. This makes it vulnerable to **ARP poisoning**:

1. Attacker sends unsolicited ARP replies to the network
2. Victim devices update their ARP cache with the attacker's MAC address mapped to a legitimate IP (e.g. the default gateway)
3. Traffic intended for the gateway now flows through the attacker
4. Attacker can intercept, read, or modify traffic — **Man-in-the-Middle (MitM)**

**Tools used:** `arpspoof`, `ettercap`, `bettercap`

**Defence:** Dynamic ARP Inspection (DAI) on managed switches, static ARP entries for critical devices, encrypted protocols (HTTPS, SSH) so intercepted traffic is unreadable.

---

## 7. Protocols and Network Services

### DHCP — Dynamic Host Configuration Protocol

**DHCP** automates the assignment of IP addresses to devices on a network. Without DHCP, every device would need a manually configured IP address.

**DHCP DORA process:**

| Step            | Direction                    | Description                                |
| --------------- | ---------------------------- | ------------------------------------------ |
| **D**iscover    | Client → Network (broadcast) | Client announces it needs an IP address    |
| **O**ffer       | Server → Client              | DHCP server offers an available IP address |
| **R**equest     | Client → Network (broadcast) | Client formally requests the offered IP    |
| **A**cknowledge | Server → Client              | Server confirms the lease                  |

DHCP also provides: subnet mask, default gateway, DNS server addresses, lease duration.

**Security relevance:** **Rogue DHCP servers** — an attacker sets up a DHCP server that responds before the legitimate one, handing out attacker-controlled DNS and gateway settings. Victims are silently redirected. Defence: DHCP snooping on managed switches.

### DNS — Domain Name System

**DNS** translates human-readable domain names into IP addresses. Without DNS, every website visit would require typing an IP address.

**DNS hierarchy:**

```
Root Servers (.)
    └── Top-Level Domains (.com, .org, .net, .ng)
            └── Second-Level Domains (example.com)
                    └── Subdomains / Hostnames (www.example.com)
```

**DNS resolution process:**

1. PC sends query to **Recursive DNS resolver** (usually provided by ISP or set manually e.g. 8.8.8.8)
2. Recursive resolver queries **Root Server** — which TLD server to ask
3. Root Server points to **TLD Server** (.com, .org etc.)
4. TLD Server points to **Authoritative DNS Server** for the domain
5. Authoritative server returns the IP address
6. Recursive resolver caches and returns the answer to the client

**Common DNS record types:**

| Record | Purpose                                                |
| ------ | ------------------------------------------------------ |
| A      | Maps domain to IPv4 address                            |
| AAAA   | Maps domain to IPv6 address                            |
| MX     | Mail server for the domain                             |
| CNAME  | Alias — points one domain to another                   |
| TXT    | Text records — used for SPF, DKIM, domain verification |
| NS     | Nameserver records — which servers are authoritative   |
| PTR    | Reverse DNS — IP to domain name                        |

**Security relevance:**

- **DNS enumeration** — querying DNS records reveals subdomains, mail servers, and infrastructure during recon
- **DNS zone transfer** — if misconfigured, an attacker can request a copy of the entire DNS zone, revealing all records at once (`dig axfr @nameserver domain.com`)
- **DNS poisoning / cache poisoning** — injecting false DNS records into a resolver's cache, redirecting users to attacker-controlled IPs
- **DNS tunnelling** — encoding data in DNS queries to exfiltrate data or bypass firewalls

### Common Ports and Protocols

Ports are numerical identifiers that direct traffic to the correct application on a device. Range: 0–65535.

**Port categories:**

| Range       | Name                        | Description                                                              |
| ----------- | --------------------------- | ------------------------------------------------------------------------ |
| 0–1023      | Well-Known Ports            | Reserved for common, universally recognized services — managed by IANA   |
| 1024–49151  | Registered Ports            | Assigned to specific services by IANA but less strictly controlled       |
| 49152–65535 | Dynamic/Private (Ephemeral) | Used by client applications temporarily when making outbound connections |

**Essential ports to know:**

| Port | Protocol | Service                            |
| ---- | -------- | ---------------------------------- |
| 21   | TCP      | FTP (File Transfer)                |
| 22   | TCP      | SSH (Secure Shell)                 |
| 23   | TCP      | Telnet (unencrypted remote access) |
| 25   | TCP      | SMTP (email sending)               |
| 53   | TCP/UDP  | DNS                                |
| 80   | TCP      | HTTP                               |
| 110  | TCP      | POP3 (email retrieval)             |
| 143  | TCP      | IMAP (email retrieval)             |
| 443  | TCP      | HTTPS                              |
| 445  | TCP      | SMB (Windows file sharing)         |
| 3306 | TCP      | MySQL                              |
| 3389 | TCP      | RDP (Remote Desktop)               |
| 5432 | TCP      | PostgreSQL                         |
| 8080 | TCP      | HTTP alternate / web proxies       |

**Security relevance:** During port scanning, open ports reveal what services are running. Each service is a potential entry point — especially if running an outdated version with a known CVE. Ports 22, 80, 443, 445, and 3389 are universally targeted in external scans.

### NAT — Network Address Translation

**NAT** allows multiple devices on a private network to share a single public IP address — solving the IPv4 exhaustion problem for internal networks.

**How it works:** The router maintains a translation table mapping internal IP:port combinations to the single public IP. Outbound packets get the public IP substituted in; inbound responses are translated back to the internal address.

**NAT types:**

| Type                               | Description                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Static NAT**                     | One-to-one mapping — one private IP always maps to one public IP                                         |
| **Dynamic NAT**                    | Pool of public IPs assigned dynamically as needed                                                        |
| **PAT (Port Address Translation)** | Many-to-one — multiple private IPs share one public IP, differentiated by port. Also called NAT Overload |

**Benefits:**

- Conserves limited IPv4 address space
- Provides basic layer of obscurity — internal IPs are not directly reachable from the internet
- Flexible internal IP addressing schemes

**Security relevance:** NAT is not a firewall — it provides obscurity, not protection. Internal devices initiating connections outbound can still be attacked via those connections. Attackers who gain internal access see the real private IP range regardless of NAT.

---

## Key Takeaways — Section 3

- ARP maps IP addresses to MAC addresses at Layer 2 — it has no authentication, making it vulnerable to poisoning
- ARP poisoning enables MitM attacks — encrypted protocols (HTTPS, SSH) are the only reliable protection once the network layer is compromised
- DHCP automates IP assignment via DORA — rogue DHCP servers are a real LAN attack vector
- DNS translates domain names to IPs through a hierarchy of resolvers — misconfigured DNS enables zone transfers and poisoning attacks
- DNS enumeration is one of the first steps in external recon — subdomains, MX records, and NS records all reveal attack surface
- Know your ports — 22, 80, 443, 445, 3389 are the most commonly targeted in external scans
- NAT hides internal networks behind a single public IP — it is not a security control, it is an addressing solution
