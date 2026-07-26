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
