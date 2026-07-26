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
