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

---

## 8. Network Components

### Components of a Network

A network is made up of three categories of components working together:

**End Devices (Hosts)** — the primary interface for users. These generate and consume network traffic:

- Computers, smartphones, tablets
- IoT devices (cameras, smart home devices)
- Printers, servers

**Intermediary Devices** — connect end devices and manage traffic flow across the network:

- **Switches** — forward frames within a LAN based on MAC addresses (Layer 2)
- **Routers** — forward packets between networks based on IP addresses (Layer 3). Use routing tables and protocols like OSPF (Open Shortest Path First) and BGP (Border Gateway Protocol) to find the most efficient path
- **Modems** — convert digital signals to analog for transmission over phone/cable lines
- **Access Points** — provide wireless connectivity to wired networks
- **Firewalls** — filter traffic based on rules

**Network Media and Software Components** — the physical and logical infrastructure:

- Cables, wireless signals
- Protocols, management software, firewalls

**Servers** — provide services to other devices on the network:

- Web servers, file servers, mail servers, database servers

### Transmission Types

**Analog transmission** — continuous signal carrying information (e.g. radio waves). Used in older telephone systems.

**Digital transmission** — employs discrete signals (bits) to encode data. Used in all modern computer networks.

### Transmission Modes

How data flows between devices:

| Mode            | Direction                      | Example                               |
| --------------- | ------------------------------ | ------------------------------------- |
| **Simplex**     | One-way only                   | Keyboard to computer, TV broadcast    |
| **Half-Duplex** | Two-way but not simultaneously | Walkie-talkies, older Ethernet hubs   |
| **Full-Duplex** | Two-way simultaneously         | Phone calls, modern Ethernet switches |

### Transmission Media

The physical medium over which data travels:

**Wired:**

- **Twisted Pair Cables** — most common, used in Ethernet (Cat5e, Cat6). Two types: UTP (unshielded) and STP (shielded)
- **Coaxial Cables** — used in cable TV and older networks. More shielding than twisted pair
- **Fibre Optic Cables** — transmits data as light pulses. Extremely high speed and long distance. Immune to electromagnetic interference

**Wireless:**

- **Radio Waves** — Wi-Fi and cellular networks. Can penetrate walls but susceptible to interference
- **Microwaves** — satellite communications. High speed but requires line of sight
- **Infrared** — short range only (e.g. TV remotes)

**Security relevance:** Wired media is generally more secure — physical access is required to tap it. Wireless signals broadcast through the air and can be intercepted by anyone within range. Wi-Fi security (WPA2/WPA3) exists precisely because the medium is openly accessible.

---

## 9. Network Architecture

**Internet Architecture** describes how data is organised, transmitted, and managed across networks.

### Architecture Models

**Peer-to-Peer (P2P)** — devices communicate directly with each other without a central server. Each device acts as both client and server. Simple to set up but difficult to manage and secure at scale. Common in file sharing.

**Client-Server** — clients request services from dedicated servers. Centralised management and security controls. Used in websites, email, enterprise applications.

**Single-Tier** — all components (presentation, logic, data) on one machine. Simple but not scalable and poor security isolation.

**Two-Tier** — client communicates directly with the database. Faster but tight coupling creates security risks.

**Three-Tier** — presentation, application logic, and database on separate layers. Standard for modern web applications. Security can be enforced at each layer boundary.

**N-Tier** — further decomposition for large-scale systems. Microservices architecture is an example.

### Network Topologies

How devices are physically or logically arranged:

| Topology   | Description                           | Security Consideration                                            |
| ---------- | ------------------------------------- | ----------------------------------------------------------------- |
| **Bus**    | All devices on one cable              | Single point of failure; easy to sniff traffic                    |
| **Star**   | All devices connect to central switch | Switch failure takes down network; traffic isolated between ports |
| **Ring**   | Devices connected in a circle         | Traffic passes through every node                                 |
| **Mesh**   | Every device connects to every other  | Highly resilient; complex to manage                               |
| **Hybrid** | Combination of topologies             | Most enterprise networks                                          |

### Wireless Networks

A wireless network uses radio waves or other wireless signals to connect devices without physical cables.

**Wi-Fi frequency bands:**

- **2.4 GHz** — longer range, penetrates walls better, but slower and more prone to interference
- **5 GHz** — faster speeds but shorter range
- **6 GHz (Wi-Fi 6E)** — newest band, least congested

**Wireless access methods:**

- Wireless router
- Mobile hotspot
- Cell tower

**Wireless security protocols (in order of security):**

| Protocol | Security Level | Notes                                         |
| -------- | -------------- | --------------------------------------------- |
| WEP      | ❌ Broken      | Cracked in minutes; never use                 |
| WPA      | ⚠️ Weak        | Deprecated                                    |
| WPA2     | ✅ Acceptable  | Still widely used; KRACK vulnerability exists |
| WPA3     | ✅ Strong      | Current standard; use where available         |

**Security relevance:** Wireless networks are inherently more exposed than wired networks — the signal is available to anyone within range. WEP and WPA can be cracked with tools like `aircrack-ng`. WPA2 with a weak passphrase is vulnerable to offline dictionary attacks after capturing the four-way handshake.

---

## 10. Network Security

### CIA Triad in Networking

Network security goals map directly to the CIA triad:

- **Confidentiality** — only authorised users can view data. Enforced through encryption, access controls, VPNs
- **Integrity** — data remains accurate and unaltered in transit. Enforced through hashing, digital signatures, checksums
- **Availability** — network resources are accessible when needed. Protected against DoS/DDoS, hardware failure, misconfigurations

### Firewalls

A **firewall** filters network traffic based on defined rules — permitting or blocking packets based on IP address, port, protocol, and state.

**Types of firewalls:**

| Type                                | Description                                                                                  |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| **Packet Filtering**                | Inspects individual packets against static rules. Fast but no context                        |
| **Stateful Inspection**             | Tracks connection state. Understands whether a packet is part of an established connection   |
| **Application Layer (Proxy)**       | Inspects traffic at Layer 7. Can understand protocols like HTTP, FTP                         |
| **Next-Generation Firewall (NGFW)** | Combines stateful inspection with deep packet inspection, IDS/IPS, and application awareness |

### IDS and IPS

| System  | Full Name                   | Function                                                            |
| ------- | --------------------------- | ------------------------------------------------------------------- |
| **IDS** | Intrusion Detection System  | Monitors traffic and alerts on suspicious activity — does not block |
| **IPS** | Intrusion Prevention System | Monitors and actively blocks suspicious traffic in real time        |

**Deployment types:**

- **Network-based (NIDS/NIPS)** — sensor connected to the core switch monitoring all traffic
- **Host-based (HIDS/HIPS)** — installed on individual devices

**Important caveat:** WAFs and IDS/IPS can be bypassed. They provide defence-in-depth but developers and security engineers should not rely solely on appliances — fixing the underlying vulnerability is always the priority.

### Network Diagnostic Tools

Essential tools for understanding network behaviour — used by both administrators and penetration testers:

**`ifconfig -a`** — displays all network interfaces and their current configuration including IP addresses, MAC addresses, and status. `lo` is the loopback interface (127.0.0.1).

**`netstat -tulnp4`** — displays active network connections, routing tables, and interface statistics. Shows which ports are listening and which processes own them. `-tulnp` without the `4` shows both IPv4 and IPv6.

**`ip route get <target IP>`** — displays the route taken for traffic sent to a specific destination. Reveals the gateway and interface used.

**`ping -c 4 <target IP>`** — tests reachability of a host. TTL (Time to Live) in the response reveals OS hints (Linux default TTL: 64, Windows: 128).

**`nmap <target IP>`** — runs a port scan and identifies what ports are open on a target machine, what services are running, and in some cases the OS and service versions.

**`nc <target IP> <port>`** — netcat, the Swiss Army knife of networking. Connects raw TCP/UDP to any port for banner grabbing, file transfer, or reverse shells.

---

## Key Takeaways — Section 4

- Networks consist of end devices, intermediary devices (switches, routers, firewalls), and transmission media — each is an attack surface
- Full-duplex is the standard for modern networks — switches enable simultaneous bidirectional communication
- Three-tier architecture separates presentation, logic, and data — security controls can be enforced at each layer boundary
- WEP is broken, WPA is deprecated, WPA2 is acceptable, WPA3 is the current standard — always check what protocol a target wireless network uses
- Firewalls filter traffic but NGFWs provide the most comprehensive protection through deep packet inspection and application awareness
- IDS detects, IPS prevents — neither replaces fixing the underlying vulnerability
- `ifconfig`, `netstat`, `ping`, `ip route`, `nmap`, and `nc` are the fundamental network diagnostic and reconnaissance tools — know them cold

---

## 11. How the Internet Works — End to End

Understanding how a single web request travels from browser to server and back ties every concept in this module together. This is the mental model every penetration tester and security engineer needs to hold.

### Browsing the Internet — Full Request Flow

When you type `https://www.example.com/home.html` into a browser and hit enter, here is what actually happens:

```
1. DNS Lookup
   Browser checks local cache → OS cache → Recursive resolver
   Recursive resolver queries: Root → TLD (.com) → Authoritative NS
   Returns: 93.184.216.34 (IP address for example.com)

2. TCP Connection (Three-Way Handshake)
   Client → Server: SYN
   Server → Client: SYN-ACK
   Client → Server: ACK
   [Connection established on port 443]

3. TLS Handshake (HTTPS)
   Certificates exchanged, encryption negotiated
   Symmetric session key established

4. HTTP Request
   GET /home.html HTTP/1.1
   Host: www.example.com

5. Data Encapsulation (down the stack)
   Application layer  → HTTP request
   Transport layer    → TCP segment (adds port numbers)
   Internet layer     → IP packet (adds source/destination IP)
   Network Access     → Ethernet frame (adds MAC addresses)

6. NAT Translation
   Router replaces private source IP with public IP
   Records mapping in NAT table

7. Routing
   Packet hops across routers toward destination
   Each router consults its routing table, forwards to next hop

8. Server Receives and Processes
   Decapsulation reverses the stack
   Web server processes the HTTP request
   Returns HTTP response with the requested resource

9. Response Travels Back
   Same process in reverse
   NAT translates public IP back to private client IP

10. Decapsulation and Display
    Browser receives response
    Renders HTML, CSS, JavaScript
    Page displays
```

Every step in this flow is an opportunity for an attacker to intercept, manipulate, or disrupt. DNS poisoning hijacks step 1. MitM via ARP poisoning hijacks step 5. SSL stripping attacks target step 3. Port scanning probes step 2.

### Data Encapsulation

As data moves down the OSI stack from application to physical, each layer adds its own header (and sometimes trailer) — this is **encapsulation**:

```
Application   → Data
Transport     → [TCP Header] + Data           = Segment
Network       → [IP Header] + Segment         = Packet
Data Link     → [Frame Header] + Packet + [FCS] = Frame
Physical      → Bits transmitted over medium
```

On the receiving end, each layer strips its header as data moves up — this is **decapsulation**.

**Security relevance:** Packet analysis tools like Wireshark work by capturing frames and decapsulating them layer by layer, letting analysts see exactly what was transmitted at every layer of the stack.

---

## 12. Module Key Takeaways

Network Foundations is the bedrock of everything else in security. You cannot attack or defend what you don't understand. Every module from here on — penetration testing, Nmap, web attacks — assumes this knowledge.

### How Everything Connects

```
Physical Medium (cables, Wi-Fi)
        │
        ▼
Data Link Layer — MAC addresses, switches, ARP
        │
        ▼
Network Layer — IP addresses, routers, subnetting
        │
        ▼
Transport Layer — TCP/UDP, ports, connections
        │
        ▼
Application Layer — HTTP, DNS, FTP, SSH, SMTP
        │
        ▼
Security Controls — Firewalls, IDS/IPS, encryption
```

An attacker who gains access to any layer can potentially attack everything above it. A compromised switch can poison ARP. A router under attacker control can redirect all traffic. Physical access to a cable allows passive sniffing.

### Core Principles

- **Every device needs an address** — MAC at Layer 2 for local delivery, IP at Layer 3 for routed delivery
- **Protocols have no memory of past interactions by default** — stateless protocols like UDP and DNS must be secured at the application layer
- **Encryption is not optional** — unencrypted protocols (Telnet, FTP, HTTP) send credentials and data in plaintext across the wire. Always prefer SSH, SFTP, HTTPS
- **Segmentation limits blast radius** — subnetting and VLANs prevent an attacker who compromises one segment from freely reaching others
- **Open ports are open doors** — every listening service is an attack surface. Reduce exposure by closing unnecessary ports and services
- **Default configurations are insecure** — default credentials, open ports, and permissive firewall rules are the first things an attacker checks

### What This Means for Penetration Testing

The network reconnaissance phase of a penetration test applies every concept from this module:

1. **Scope definition** — identify IP ranges and subnets in scope using CIDR notation
2. **Host discovery** — `ping` sweeps and ARP scans to find live hosts
3. **Port scanning** — `nmap` to identify open ports and services per host
4. **Service enumeration** — banner grabbing with `nc`, version detection with `nmap -sV`
5. **DNS enumeration** — zone transfers, subdomain brute-forcing, record lookups
6. **Traffic analysis** — Wireshark to capture and inspect packets if network access is available
7. **Wireless assessment** — identify SSIDs, encryption protocols, and capture handshakes if in scope

Every tool and technique in the CJCA path builds on the foundation laid here.

---

_Module completed July 2026 — HackTheBox Academy, Junior Cybersecurity Analyst path_

---

## 11. How It All Connects — Browsing the Internet

Understanding how a simple browser request traverses all the layers and concepts covered in this module ties everything together. Here is what actually happens when you type `https://www.example.com/page` and hit Enter.

### Step-by-Step: A Web Request from End to End

**1. DNS Lookup**
The browser needs to resolve `www.example.com` to an IP address. It checks its local cache first, then queries the recursive DNS resolver. The resolver walks the DNS hierarchy — root → TLD → authoritative — and returns the IP address. The browser now knows where to send the request.

**2. Checking Local Network Configuration**
The device checks its network interface configuration (`ifconfig`) to confirm it has a valid IP address, subnet mask, and default gateway — assigned either statically or via DHCP.

**3. Routing the Packet**
The device determines whether the destination IP is on the local subnet or needs to go through the default gateway. If remote, the packet is sent to the router.

**4. ARP Resolution**
Before sending the packet to the router, the device needs the router's MAC address. It checks its ARP cache. If not found, it broadcasts an ARP request. The router responds with its MAC address. The packet can now be addressed at Layer 2.

**5. Data Encapsulation**
The data travels down the network stack, gaining headers at each layer:

```
Application Layer  → HTTP/S request data
Transport Layer    → TCP header (source/dest port, sequence numbers)
Internet Layer     → IP header (source/dest IP address)
Network Access     → Ethernet frame (source/dest MAC address)
```

**6. Transmission**
The frame travels across the physical medium — Ethernet cable or Wi-Fi — to the router, which strips the frame, reads the IP header, consults its routing table, and forwards the packet toward the destination.

**7. NAT Translation**
The router replaces the private source IP with its public IP address and records the mapping in the NAT table. The packet continues across the internet.

**8. Server Receives and Responds**
The destination server receives the packet, decapsulates up through the stack, processes the HTTP request, and sends a response back through the same process in reverse.

**9. Decapsulation and Display**
The response arrives, NAT translates the destination back to the internal IP, the device decapsulates the frame layer by layer, and the browser renders the page.

This entire process — DNS lookup, ARP resolution, DHCP assignment, IP routing, NAT translation, TCP handshake, HTTP exchange — happens in milliseconds every time you load a page. Every step is a potential point of attack.

---

## 12. Module Key Takeaways

### The Security Mindset Applied to Networks

A network engineer asks: _is traffic getting where it needs to go?_

A security engineer asks: _where can traffic be intercepted, manipulated, or blocked — and what can an attacker do with it?_

Every protocol covered in this module has a corresponding attack. ARP has poisoning. DNS has poisoning and enumeration. DHCP has rogue servers. Wi-Fi has WPA cracking. TCP has SYN floods. Unencrypted protocols have sniffing. The pattern is consistent: protocols designed for functionality, not security, become attack vectors.

### The Stack Is the Map

```
Layer 7 — Application     XSS, SQLi, HTTP exploits, DNS poisoning
Layer 6 — Presentation    SSL/TLS attacks, weak encryption
Layer 5 — Session         Session hijacking
Layer 4 — Transport       Port scanning, SYN floods, firewall evasion
Layer 3 — Network         IP spoofing, routing attacks, ICMP exploits
Layer 2 — Data Link       ARP poisoning, MAC spoofing, VLAN hopping
Layer 1 — Physical        Cable tapping, rogue access points
```

During a penetration test, understanding which layer a vulnerability lives on tells you which tool to reach for. Nmap operates at Layers 3 and 4. ARP spoofing tools operate at Layer 2. Application scanners like Burp Suite operate at Layer 7.

### Core Principles

- **Every protocol is a potential attack vector** — understand the protocol, understand the attack
- **Encryption is the last line of defence on a compromised network** — if an attacker controls Layer 2, they can intercept everything that isn't encrypted
- **Segmentation limits blast radius** — subnets, VLANs, and firewalls contain lateral movement after initial compromise
- **DNS is infrastructure** — controlling DNS means controlling where traffic goes
- **Know your ports** — open ports are open doors; every unnecessary service is unnecessary attack surface
- **Defence in depth** — no single control is sufficient; firewalls, IDS/IPS, encryption, segmentation, and monitoring work together

### What This Module Enables

With these foundations in place, every subsequent module builds on them:

- **Network Enumeration With Nmap** — applies port scanning, service detection, and OS fingerprinting directly to the concepts of TCP/IP, ports, and protocols
- **Penetration Testing** — reconnaissance, scanning, and exploitation all require understanding how networks move data
- **Machine writeups** — every HTB machine involves network services running on specific ports; knowing what those services are and how they communicate is the starting point of every attack chain

---

_Module completed July 2026 — HackTheBox Academy, Junior Cybersecurity Analyst path_
