# Introduction To Information Security — HackTheBox Academy

**Module:** Introduction To Information Security
**Platform:** HackTheBox Academy
**Path:** Junior Cybersecurity Analyst (CJCA)
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Introduction To Information Security establishes the conceptual foundation for everything else in the CJCA path. Before learning to attack or defend specific systems, you need to understand what information security actually is, why it exists, what it protects, who is responsible for it, and what the threat landscape looks like.

This module reframes security not as a technical discipline alone, but as an organisational and strategic function — one that requires both technical tools and human awareness to work.

---

## 1. What Is Information Security?

**Information Security (InfoSec)** is the practice of safeguarding information and systems from people who must not have access to them.

It encompasses the policies, processes, tools, and controls that protect data from unauthorised access, use, disclosure, modification, or destruction — whether that data is stored, processed, or transmitted.

### Structure of InfoSec

Information security operates across three dimensions:

- **Structure** — the frameworks, policies, and governance that define how security is managed
- **Security** — the technical and procedural controls that protect systems and data
- **Implementation** — the actual deployment of those controls across people, processes, and technology

### Purpose of InfoSec

Information security exists for six core reasons:

1. **Protecting sensitive data from unauthorised access** — customer data, financial records, intellectual property
2. **Ensuring business continuity** — keeping systems operational during and after incidents
3. **Maintaining regulatory compliance** — GDPR, HIPAA, PCI-DSS, and other frameworks mandate security controls
4. **Preserving brand reputation** — a breach destroys trust; trust is hard to rebuild
5. **Safeguarding intellectual property** — source code, trade secrets, research and development
6. **Enabling secure digital transformation** — organisations cannot adopt new technologies safely without security foundations in place

---

## 2. The CIA Triad

The **CIA Triad** is the foundational model of information security. Every security control, policy, and decision maps back to one or more of these three principles.

### Confidentiality

**Confidentiality** ensures that information is accessible only to those authorised to access it. It protects against unauthorised disclosure.

- Ensures information is accessible only to authorised individuals
- Protects against unauthorised disclosure of information
- Implemented through encryption, access controls, and data classification
- Broken by: data breaches, credential theft, insider leaks, unencrypted storage

**Examples in practice:**

- Encrypting data at rest and in transit
- Role-based access control (RBAC) — users only see what their role permits
- Data classification — marking data as Public, Internal, Confidential, or Secret

### Integrity

**Integrity** maintains and assures the accuracy and completeness of data over its entire lifecycle. It protects against unauthorised modification.

- Maintains and assures the accuracy and completeness of data over its entire lifecycle
- Protects against unauthorised modification or corruption
- Implemented through hashing, digital signatures, and audit logs
- Broken by: man-in-the-middle attacks, malware modifying files, SQL injection altering database records

**Examples in practice:**

- File hashing — SHA-256 checksums verify files haven't been modified
- Digital signatures — cryptographically verify the source and integrity of messages
- Write-once storage for logs — prevents tampering with audit trails

### Availability

**Availability** ensures that information and systems are accessible and usable when needed by authorised users.

- Ensures systems and data are accessible when needed
- Protects against denial of service, hardware failure, and disasters
- Implemented through redundancy, backups, failover systems, and DDoS mitigation
- Broken by: DDoS attacks, ransomware, hardware failure, power outages

**Examples in practice:**

- Load balancing and redundant servers
- Regular backups with tested restoration procedures
- Disaster Recovery and Business Continuity planning

### Why the CIA Triad Matters for Security Testing

Every vulnerability maps to one or more CIA properties:

| Vulnerability         | CIA Impact                                                  |
| --------------------- | ----------------------------------------------------------- |
| SQL Injection         | Confidentiality (data theft), Integrity (data modification) |
| XSS                   | Confidentiality (session theft)                             |
| DDoS                  | Availability                                                |
| Ransomware            | Availability (encryption), Integrity (data modification)    |
| Broken Access Control | Confidentiality                                             |
| Man-in-the-Middle     | Confidentiality, Integrity                                  |

---

## 3. Domains of Information Security

Information security is not a single discipline — it spans multiple specialised domains, each with its own threat landscape, tools, and expertise.

### Network Security

Protects computer networks from threats — both external hackers and internal threats. The security system of the network, safeguarding data and devices from intrusion.

Key controls: Firewalls, IDS/IPS, VPNs, access control mechanisms, network segmentation.

**Compliance** — adhering to rules everyone must follow (regulations, standards).
**Governance** — the overarching framework that sets how compliance is managed and enforced.

### Application Security (AppSec)

Focuses on protecting software applications from external threats throughout their entire lifecycle — from design through development, deployment, and ongoing maintenance. It preserves the CIA triad at the application layer.

Begins from the software development lifecycle (SDLC) and continues through to deployment and ongoing maintenance. Secure coding + rigorous testing procedures are the two pillars.

**Responsibilities:**

- Application Developers — writing secure code and implementing security features
- Security Architects — designing the overall security structure of applications and their supporting infrastructure
- Operations Teams — responsible for maintaining the security of production environments

### Operational Security (OpSec)

Processes, practices, and decisions related to handling and protecting data assets throughout their lifecycle. Maintains a secure environment for an organisation's day-to-day operations — ensuring sensitive information remains confidential, intact, and available only to authorised individuals.

**OpSec processes:**

- Assets Identification — identifying critical information and assets
- Threats Identification — determining who might want to access those assets
- Vulnerability Identification — finding weaknesses that could be exploited
- Access Control — limiting who can reach critical assets
- Monitoring — continuously watching for anomalous behaviour

### Disaster Recovery and Business Continuity (DR & BC)

Critical components of an organisation's resilience strategy, designed to ensure that a company can continue to operate in the face of significant disruptions.

- **Disaster Recovery (DR)** — focuses on restoring IT systems and data after a disruption
- **Business Continuity (BC)** — broader — ensures the entire organisation can continue operating

### Cloud Security

Protecting data, applications, and infrastructure in cloud computing environments.

**Key cloud security threats:**

- Data breaches
- Insecure APIs
- Misconfigured cloud storage
- Account hijacking

**Areas of cloud security:**

- Data protection — encryption of data both at rest and in transit
- Identity and Access Management (IAM)
- Shared responsibility model — security obligations split between cloud provider and customer

**Shared Responsibility:**

- Cloud Service Providers — ensure the cloud infrastructure itself is secure
- You/Administrator — responsible for securing what you put in the cloud (access control, strong passwords, encryption of your data)
- Security Teams — plan and oversee security measures

### Physical Security

Protection of actual hardware and facilities that store and process data — including computers, servers, server racks, network equipment, and even printed documents.

**Responsibilities:**

- Facilities Management Team — maintains the building and ensures physical security measures are in place and functioning
- IT Security Team — focuses on securing the hardware and network equipment
- All Employees — shared responsibility for physical access control

### Mobile Security

Focuses on protecting mobile devices, the data they store, and the networks they connect to — against a wide range of threats. Safeguards sensitive information stored and transmitted by mobile devices.

**Four layers of mobile security:**

- Device Security — passcodes, biometrics
- Data Security — encryption of data
- Network Security — VPNs
- Application Security — app vetting

**Responsibilities:**

- IT Departments — implement and manage security solutions (network and device encryption)
- CISOs — develop overarching security strategies, assess risks associated with mobile device use
- Security Teams — specialise in testing and assessing security measures, conducting tests to identify vulnerabilities
- IT Security Managers — oversee day-to-day operations

### Internet of Things (IoT) Security

Safeguarding interconnected devices and the networks they operate on from unauthorised access, data theft, and other cyber threats.

**Responsibilities:**

- Device Manufacturers — architects and builders — security must be designed in, not bolted on
- Network Administrators — guards of the network perimeter
- Application Developers — scribes and scholars — secure the software running on devices

---

## Key Takeaways — Section 1

- Information security is the practice of safeguarding information and systems from unauthorised access — it spans people, processes, and technology
- The CIA Triad (Confidentiality, Integrity, Availability) is the framework behind every security decision — every vulnerability breaks one or more of these
- InfoSec spans nine domains — Network, AppSec, OpSec, DR/BC, Cloud, Physical, Mobile, and IoT — each with distinct threats and controls
- Cloud security operates on a shared responsibility model — the provider secures the infrastructure, you secure what you put in it
- Physical security is often overlooked but a server you can physically access is a server you can compromise
- IoT devices are frequently shipped with poor default security — they expand the attack surface significantly

---

## 4. Threat Landscape

### Core Definitions

Before understanding threats, three terms need to be precise — they are often confused but mean distinct things:

**Threat** — a potential cause of an incident that may result in harm to a system or organisation. A threat is what could happen.

**Vulnerability** — a weakness in a system, process, or control that could be exploited. A vulnerability is the weakness that allows the threat to cause damage — bugs, weak passwords, misconfigured systems.

**Risk** — the combination of a threat and a vulnerability. Risk represents the potential damage if a threat exploits a vulnerability.

```
Risk = Threat × Vulnerability
```

A threat with no vulnerability to exploit poses no risk. A vulnerability with no threat actor to exploit it poses no risk. Risk only exists when both are present.

---

### Threat 1 — Distributed Denial of Service (DDoS)

A **DDoS attack** is a malicious attempt to interrupt the normal functioning of a website, server, or online service by overwhelming it with a flood of internet traffic from multiple sources simultaneously.

Sources are often compromised computers or devices infected with malware — collectively known as a **botnet** (also called an amplification network).

**Three main components of a DDoS attack:**

| Component        | Role                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| **The Attacker** | Person or group coordinating the attack, aiming to disrupt a specific target                                         |
| **The Botnet**   | A network of compromised devices spread across various locations — personal computers, servers, and even IoT devices |
| **The Victim**   | The targeted server, service, or network                                                                             |

**Real-world example:** The **Mirai** botnet infected hundreds of thousands of IoT devices (cameras, routers) and used them to launch one of the largest DDoS attacks in history against DNS provider Dyn in 2016 — taking down major websites including Twitter, Netflix, and GitHub.

**Impact:** Service unavailability, financial loss, reputational damage, operational disruption.

**Defence:** DDoS mitigation services (Cloudflare, AWS Shield), rate limiting, traffic scrubbing, anycast network diffusion.

---

### Threat 2 — Ransomware

**Ransomware** is a type of malicious software (malware) that infiltrates servers, computers, and networks — encrypting valuable files so they become inaccessible. The attackers then demand a ransom payment (often in cryptocurrency like Bitcoin) in exchange for the decryption key.

**Digital hostage-taking.**

**How it typically spreads:**

- Phishing emails with malicious attachments
- Exploiting unpatched vulnerabilities (EternalBlue/WannaCry spread via SMBv1)
- Remote Desktop Protocol (RDP) with weak or stolen credentials
- Drive-by downloads from compromised websites

**Notable examples:**

- **WannaCry (2017)** — exploited EternalBlue (MS17-010) to spread across networks, encrypting files on unpatched Windows systems globally
- **NotPetya (2017)** — disguised as ransomware, was actually a destructive wiper. Caused $10 billion in damages
- **REvil, LockBit, BlackCat** — modern ransomware-as-a-service (RaaS) operations

**Defence:** Regular offline backups, patch management, endpoint detection and response (EDR), network segmentation (limits spread), principle of least privilege.

---

### Threat 3 — Social Engineering

**Social engineering** relies on psychological manipulation to deceive individuals into revealing confidential information or taking actions that compromise security. It attacks the human layer — the most consistently exploitable layer in any organisation.

**Five fundamental techniques:**

| Technique        | Description                                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Phishing**     | Fraudulent emails that look like trusted sources, sent to steal usernames, passwords, or card numbers. Mass distributed     |
| **Pretexting**   | Creating a fabricated scenario (pretext) to extract information or persuade a target to perform an action                   |
| **Baiting**      | Using the promise of something enticing (free software, USB drive left in a car park) to lure victims into a trap           |
| **Quid Pro Quo** | Offering a service in exchange for information (e.g. fake IT support offering to fix a problem in exchange for credentials) |
| **Tailgating**   | An attacker physically follows an authorised person into a restricted area without proper credentials                       |

**Why social engineering works:** It bypasses technical controls entirely by targeting human psychology — trust, urgency, authority, fear, and curiosity are all exploited.

**Defence:** Security awareness training, phishing simulations, multi-factor authentication (MFA), strict visitor policies, clear escalation procedures for suspicious requests.

---

### Threat 4 — Insider Threats

An **insider threat** refers to the danger that comes from individuals who have authorised access to an organisation's resources — such as employees, contractors, or business partners — who misuse that access.

**Three types of insider:**

| Type                    | Description                                                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Malicious Insider**   | Intentionally seeks to cause harm — data theft, sabotage, espionage. Motivated by financial gain, grievance, or ideology                              |
| **Negligent Insider**   | Does not intend to cause harm but does so through carelessness or lack of awareness — clicking phishing links, misconfiguring systems, losing devices |
| **Compromised Insider** | An otherwise legitimate user whose credentials or device have been taken over by an external attacker via social engineering                          |

**Why insiders are dangerous:** They already have authorised access — traditional perimeter defences do not stop them. They know where sensitive data lives and how systems are structured.

**Defence:** Principle of least privilege, user behaviour analytics (UBA), DLP (Data Loss Prevention) tools, offboarding procedures, monitoring of privileged access.

---

### Threat 5 — Advanced Persistent Threats (APTs)

An **APT** is a continuous cyber operation where an attacker gains unauthorised access to a company's network and remains undetected for an extended period — often months or years.

Unlike opportunistic attacks, APTs are:

- **Targeted** — specific organisations or sectors
- **Stealthy** — designed to avoid detection
- **Persistent** — maintain long-term access
- **Resourced** — often nation-state or well-funded criminal groups

**Goal:** Intelligence gathering, intellectual property theft, long-term espionage, or pre-positioning for future destructive attacks.

**Famous APTs:** APT28 (Fancy Bear — Russia), APT41 (China), Lazarus Group (North Korea).

**Defence:** Threat hunting, network traffic analysis, endpoint detection, privileged access management, regular security audits.

---

## Key Takeaways — Section 2

- Risk = Threat × Vulnerability — risk only exists when both are present simultaneously
- DDoS attacks overwhelm targets using botnets of compromised devices — availability is the CIA property attacked
- Ransomware encrypts data and demands payment — patch management, backups, and segmentation are the primary defences
- Social engineering attacks humans, not systems — MFA and security awareness training are the primary controls
- Insider threats are the hardest to detect — they already have authorised access and know where the data is
- APTs are long-term, targeted, and stealthy — their goal is persistence and intelligence, not immediate destruction
- The human layer is consistently the weakest link — no technical control fully compensates for an untrained user
