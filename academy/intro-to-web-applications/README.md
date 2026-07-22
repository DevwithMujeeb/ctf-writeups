# Introduction to Web Applications — HackTheBox Academy

**Module:** Introduction to Web Applications
**Platform:** HackTheBox Academy
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Introduction to Web Applications covers how modern web applications are built, how they work, and what dangers they introduce into a corporate environment. Coming from a backend development background, this module reframes familiar concepts through a security lens — shifting from "how do I build this" to "how does this get attacked."

A developer thinks about web apps as products. A security engineer thinks about web apps as attack surfaces.

---

## 1. Web Apps vs Websites

A **website** has static pages and therefore does not produce real time changes — content is the same for every user. A **web application** (Web 2.0) presents dynamic content — it is interactive, based on user interaction, and can perform various functionality for the end-user that websites lack.

Web apps are fully functional and can perform various functionality for the end-user while websites lock this type of functionality. Key characteristics of web apps:

- Being modular
- Running on any display size
- Running on any platform without being updated

**Web App vs Native OS App:**

- Version unity — updates happen without pushing to the user
- Does not necessarily need installation
- Native OS apps are usually more capable than web apps
- Hybrid and Progressive web apps bridge this gap

**Why web apps are a major attack surface:** Due to their availability and accessibility, they tend to be vulnerable and offer a vast attack surface. Unlike native apps, web apps are publicly accessible by anyone on the internet — every endpoint is potentially reachable by an attacker.

---

## 2. Web Application Architecture

### Web Application Infrastructure Models

Web Application Infrastructure describes the structure of required components such as the database. There are four main infrastructure models:

**Client-Server (front end and back end):** The client sends requests to the server, the server processes them and responds. All components may be on separate machines.

**One Server (simplest design — straightforward and easy to implement):** The entire web app and their components including the database are hosted on a single server. All eggs in one basket — if the server is compromised, everything is compromised.

**Many Servers — One Database:** This model separates the database into its own database server and allows the web apps' hosting server to access the database server to store and retrieve data. Main advantage is segmentation — compromising the web server doesn't automatically give database access.

**Many Servers — Many Database:** Builds upon Many Servers-One Database model. Serves as backup in case any web server or database goes offline — reduces downtime as much as possible. Also includes serverless web apps or apps that utilize microservices.

### Web Application Components

Web Application Components — the components that make up a web application divided into areas:

- **UI/UX** — what the user sees and interacts with
- **Client** — the browser or app making requests
- **Server** — processes requests and returns responses

### Web Application Architecture (Three-Tier)

**Presentation Layer** — consists of UI process components that enable communication with the application and the system. These can be accessed by the client via web browser and are returned in the form of HTML, JavaScript, and CSS.

**Application Layer** — ensures that all client requests (web browser) are correctly processed, such as authorization, privileges, and data passed on to the client.

**Data Layer** — determines exactly where the required data is stored and can be accessed.

### Microservices and Serverless

**Microservices** are independent components of the web app where in most cases each is programmed for one task. They communicate via APIs and can be scaled independently.

**Serverless** platforms — such as AWS, GCP, Azure etc. — provide application frameworks to build web applications without having to worry about the servers themselves. The cloud provider manages the infrastructure; you deploy functions.

---

## Key Takeaways — Section 1

- Web apps are dynamic and interactive — websites are static
- Web apps are publicly accessible by anyone — every endpoint is a potential attack surface
- One Server architecture is the simplest but most dangerous — all components on one machine
- Many Servers-Many Database provides the most resilience and segmentation
- Three-tier architecture (Presentation, Application, Data) is the standard for modern web apps
- Microservices and serverless reduce infrastructure burden but introduce new attack surfaces (API security, cloud misconfiguration)

---

## 3. Front End Components

The front end is everything the user sees and interacts with in the browser. It is the Presentation Layer of the three-tier architecture — and critically, it is the layer most exposed to attackers, since all of its code is delivered to and executed on the client.

### HTML

**HyperText Markup Language (HTML)** is the skeleton of every web page. It defines the structure and content of a page using a hierarchy of elements and tags.

Key structural concepts:

- The `<!DOCTYPE html>` declaration tells the browser which HTML version is in use
- `<html>` is the root element; everything lives inside it
- `<head>` contains metadata — page title, charset, linked stylesheets, scripts
- `<body>` contains the visible content of the page
- Tags wrap content: `<tag>content</tag>` — opening and closing tags define an element
- Tags can have **attributes** that modify behaviour — e.g. `<img src="image.jpg">`, `<a href="https://example.com">`

**Security relevance:** HTML structure is not sanitized by default. If user input is rendered directly into the DOM without encoding, it becomes an injection point. Attackers look for places where the app reflects user-controlled data back as raw HTML.

### CSS

**Cascading Style Sheets (CSS)** control the visual presentation of HTML elements — layout, colors, fonts, spacing, and responsiveness.

CSS can be applied three ways:

- **Inline** — directly on an element via the `style` attribute: `<h1 style="color: red;">`
- **Internal** — inside a `<style>` block in the `<head>`
- **External** — a separate `.css` file linked via `<link rel="stylesheet" href="style.css">`

CSS selectors target elements by tag name, class (`.classname`), or ID (`#idname`).

**Security relevance:** CSS itself is generally low-risk, but CSS injection is a real attack vector — particularly for exfiltrating data through attribute selectors or overriding UI elements to mislead users (clickjacking setup, fake login overlays).

### JavaScript

**JavaScript (JS)** makes web pages dynamic and interactive. It runs in the browser and can manipulate the DOM, make network requests, handle events, and store data locally.

JavaScript can be loaded three ways:

- **Inline** — inside `<script>` tags directly in the HTML
- **Internal** — in a `<script>` block in the `<head>` or `<body>`
- **External** — a separate `.js` file loaded via `<script src="app.js"></script>`

JavaScript is the most powerful front end technology — and therefore the most dangerous if misused or injected.

**Security relevance:** JavaScript is the primary vehicle for **Cross-Site Scripting (XSS)** attacks. If an attacker can inject JavaScript into a page that other users load, they can steal session cookies, redirect users, perform actions on their behalf, or exfiltrate sensitive data. JS also handles client-side validation — which is never a substitute for server-side validation, since it can be trivially bypassed.

---

## 4. Front End Vulnerabilities

The front end presents a unique security challenge: unlike the backend, all front end code is delivered to the browser and fully visible to anyone who inspects it. Attackers routinely examine page source, JavaScript files, and network requests for sensitive data and injection points.

### Sensitive Data Exposure

Developers sometimes leave sensitive information in the front end — either by mistake or for convenience during development:

- Hardcoded credentials or API keys in JavaScript files
- Internal IP addresses or backend endpoints in source code
- Comments left in HTML/JS revealing logic, staging URLs, or infrastructure details
- Developer tools and debug endpoints left exposed in production

**How attackers find it:** View page source (`Ctrl+U`), browser DevTools (Sources tab), or automated tools like `gau`, `waybackurls`, or `trufflehog` that scrape and scan JS files for secrets.

**Defence:** Never hardcode secrets in front end code. Use environment variables on the server. Strip comments and minify/obfuscate JS in production. Conduct regular source code reviews before deployment.

### HTML Injection

HTML Injection occurs when user-supplied input is rendered directly into the page as HTML without sanitization. This allows an attacker to inject arbitrary HTML elements — fake login forms, misleading content, hidden iframes.

Unlike XSS, HTML injection does not necessarily involve script execution — but it can be used for phishing, UI redressing, and as a stepping stone to XSS.

**Defence:** Encode all user input before rendering it in HTML. Use templating engines that auto-escape by default.

### Cross-Site Scripting (XSS)

**XSS** is one of the most prevalent web vulnerabilities. It occurs when an attacker injects malicious JavaScript into a page that is then executed in the browser of another user.

Three main types:

**Reflected XSS** — the malicious script is part of the request (e.g. a URL parameter) and is immediately reflected back in the response. Requires the victim to click a crafted link.

**Stored XSS** — the malicious script is saved to the database (e.g. in a comment or profile field) and is served to every user who views that content. More dangerous because it is persistent and requires no interaction beyond visiting the page.

**DOM-based XSS** — the attack payload is executed entirely in the browser by manipulating the DOM via JavaScript, without the malicious content ever being sent to the server.

**Impact of XSS:**

- Session hijacking — steal `document.cookie` and impersonate the user
- Credential theft — inject fake login forms
- Keylogging — capture keystrokes
- Redirection — send users to attacker-controlled pages
- Actions on behalf of the user — make requests as the authenticated victim

**Defence:** Encode output (HTML entity encoding), use Content Security Policy (CSP) headers, set `HttpOnly` on session cookies so JS cannot read them, validate and sanitize all input on the server.

### Cross-Site Request Forgery (CSRF)

**CSRF** tricks an authenticated user into unknowingly submitting a request to a web application they are already logged into. The attacker crafts a malicious page or link that triggers a state-changing action (change password, transfer funds, update email) using the victim's active session.

The key insight: browsers automatically attach cookies to requests for a given domain — even if the request originates from a different site. CSRF exploits this browser behaviour.

**Example flow:**

1. Victim is logged into `bank.com`
2. Attacker sends victim a link to `evil.com`
3. `evil.com` contains a hidden form that POSTs to `bank.com/transfer`
4. The browser includes the victim's `bank.com` session cookie automatically
5. The transfer executes as the authenticated victim

**Defence:** CSRF tokens (unique per-session, per-form values that the server validates), `SameSite` cookie attribute (`Strict` or `Lax`), checking `Origin` and `Referer` headers on state-changing requests.

---

## 5. OWASP Top 10

The **OWASP Top 10** is a regularly updated list of the most critical security risks to web applications, published by the Open Web Application Security Project. It is the industry-standard reference for web application security — used by developers, security engineers, and penetration testers worldwide.

Each risk in the Top 10 represents a category of vulnerabilities that are widespread, detectable, and impactful. Security decisions across all projects in this portfolio are mapped to OWASP categories.

### OWASP Top 10 — 2021 Edition

| #   | Category                                       | Description                                                                                                                                 |
| --- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| A01 | **Broken Access Control**                      | Users can act outside of their intended permissions — access other users' data, perform admin actions, bypass authorization checks          |
| A02 | **Cryptographic Failures**                     | Sensitive data exposed due to weak or missing encryption — passwords in plaintext, weak hashing algorithms, unencrypted data in transit     |
| A03 | **Injection**                                  | Untrusted data is sent to an interpreter as part of a command or query — SQL injection, NoSQL injection, command injection, XSS             |
| A04 | **Insecure Design**                            | Flaws in the design and architecture of the application — missing threat modelling, insecure defaults baked into the system                 |
| A05 | **Security Misconfiguration**                  | Default credentials left in place, unnecessary features enabled, verbose error messages, missing security headers                           |
| A06 | **Vulnerable and Outdated Components**         | Using libraries, frameworks, or dependencies with known vulnerabilities — unpatched packages, deprecated software                           |
| A07 | **Identification and Authentication Failures** | Broken login mechanisms — weak passwords permitted, no brute-force protection, insecure session management, missing MFA                     |
| A08 | **Software and Data Integrity Failures**       | Code and infrastructure not protected against integrity violations — insecure CI/CD pipelines, unverified updates, insecure deserialization |
| A09 | **Security Logging and Monitoring Failures**   | Insufficient logging of security events — attacks go undetected, no audit trail, alerts not configured                                      |
| A10 | **Server-Side Request Forgery (SSRF)**         | The server is tricked into making requests to unintended locations — internal services, cloud metadata endpoints, file systems              |

**Why OWASP matters for a developer:** Every vulnerability in the Top 10 is something a developer can introduce without realising it. Understanding OWASP is not just a security skill — it is a development discipline. The vulnerabilities covered in this module (XSS, CSRF, sensitive data exposure, broken auth, injection) all map directly to OWASP categories.

---

## Key Takeaways — Section 2

- All front end code is delivered to the browser — treat it as fully visible to attackers
- HTML structures content, CSS styles it, JavaScript makes it dynamic — JS is the highest-risk layer
- Never hardcode secrets, credentials, or internal endpoints in front end code
- XSS is injection for JavaScript — stored XSS is the most dangerous variant because it is persistent
- CSRF exploits browser cookie behaviour — `SameSite` cookies and CSRF tokens are the primary defences
- HttpOnly cookies prevent JavaScript from reading session tokens — defence-in-depth against XSS session hijacking
- OWASP Top 10 is the standard reference for web security risk — know it, map every vulnerability to it

---

## 6. Back End Components

The back end is the layer the user never sees — but it is where most of the critical logic lives: authentication, authorization, data storage, and business rules. Compromising the back end is the goal of most web attacks because that is where sensitive data actually lives.

The back end is made up of four main components: the backend server, the web server, the database, and development frameworks.

### Backend Server

The backend server is the hardware and operating system that hosts all other backend components and runs all the applications necessary to power the web application. It contains three layers of software on top of the hardware:

- **Web Server** — handles HTTP traffic
- **Web Application Logic** — the application code itself
- **Database** — stores and retrieves data

Backend servers typically run on Linux (most common in production) or Windows. The OS is itself an attack surface — misconfigurations, unpatched vulnerabilities, and unnecessary services all expand exposure.

### Web Servers

A web server is an application that runs on the backend server and handles all HTTP traffic from the client-side browser. It routes incoming requests to the correct pages or application logic, and returns responses to the client. Web servers typically listen on TCP port 80 (HTTP) or port 443 (HTTPS).

Common web servers:

| Web Server         | Language/Stack                  | Known Users                          |
| ------------------ | ------------------------------- | ------------------------------------ |
| **Apache (httpd)** | PHP, general purpose            | Apple, Adobe, BBC, Intel, Twitter    |
| **Nginx**          | High-performance, reverse proxy | Google, Facebook, Netflix, GitHub    |
| **IIS**            | Microsoft/.NET (ASP.NET)        | Microsoft ecosystem, Windows Servers |

**Security relevance:** Web servers are the first point of contact for every request. Misconfigurations at this layer — exposed directory listings, default pages left enabled, verbose server headers revealing version info — are low-effort wins for attackers.

### HTTP Response Codes

HTTP status codes communicate the result of every request. Knowing these is fundamental for web testing — response codes reveal application behaviour and can indicate vulnerabilities.

**2xx — Success**

- `200 OK` — request has succeeded

**3xx — Redirection**

- `301 Moved Permanently` — URL of the requested resource has changed permanently
- `302 Found` — URL has been changed temporarily

**4xx — Client Errors**

- `400 Bad Request` — server could not understand the request due to malformed syntax
- `401 Unauthorized` — unauthenticated attempt to access a page
- `403 Forbidden` — client does not have access rights to the content
- `404 Not Found` — server cannot find the requested resource
- `405 Method Not Allowed` — request method is known by the server but not supported for the target resource
- `408 Request Timeout` — response being sent on an idle connection timed out

**5xx — Server Errors**

- `500 Internal Server Error` — server encountered a situation it does not know how to handle
- `502 Bad Gateway` — server, while acting as a gateway, received an invalid response from the upstream server
- `504 Gateway Timeout` — server acting as a gateway could not get a response in time

**Security relevance:** 401 vs 403 reveals whether a resource exists and whether auth is required. 500 errors can indicate unhandled exceptions leaking stack traces. Unexpected 302s during testing can reveal open redirects.

### Databases

Web applications use databases to store and retrieve content, user data, and application state. The choice of database affects both performance and the nature of potential injection vulnerabilities.

Database selection factors: speed, size, scalability, cost.

#### Relational Databases (SQL)

SQL databases store data in tables with rows and columns. Relationships between tables within a database are defined by a **schema**. They use Structured Query Language (SQL) to query and manipulate data.

Common relational databases:

- **MySQL** — most widely used open-source relational DB; common in LAMP stacks
- **MSSQL (Microsoft SQL Server)** — used with Windows Servers and IIS web servers
- **Oracle** — enterprise-grade, common in large organisations
- **PostgreSQL** — open-source, highly standards-compliant, strong extension ecosystem
- **SQLite** — lightweight, file-based; common in mobile and embedded apps
- **MariaDB** — MySQL fork, drop-in compatible

**Security relevance:** If user input reaches a SQL query without proper parameterization, **SQL Injection** is possible — allowing attackers to read arbitrary data, bypass authentication, modify records, or in some cases execute OS commands via the database.

#### Non-Relational Databases (NoSQL)

NoSQL databases do not use the traditional table/row/column model. Instead, they use flexible storage models suited to different data types and access patterns. They do not use schemas or fixed relationships.

Common NoSQL storage models:

- **Key-Value** — data stored as simple key-value pairs (JSON, XML); e.g. Redis
- **Document-Based** — stores complex nested JSON documents; e.g. MongoDB, CouchDB
- **Wide Column** — data stored in columns rather than rows; e.g. Apache Cassandra
- **Graph** — data stored as nodes and edges representing relationships; e.g. Neo4j

Other examples: ElasticSearch, Amazon DynamoDB.

**Security relevance:** NoSQL databases are not immune to injection. **NoSQL Injection** exploits the query syntax of the specific database — MongoDB queries using `$where`, `$gt`, and similar operators can be manipulated if user input is not sanitized. The attack surface differs from SQL injection but the root cause is the same: unsanitized user input reaching a query interpreter.

---

## Key Takeaways — Section 3

- The backend server hosts the web server, application logic, and database — compromise any one layer and the others are at risk
- Apache, Nginx, and IIS are the dominant web servers — each has its own configuration surface and known misconfigurations
- HTTP status codes are diagnostic signals during testing — 401 vs 403, and 500 errors revealing stack traces, matter
- SQL databases are vulnerable to SQL Injection when input is not parameterized — always use prepared statements
- NoSQL databases have their own injection vectors — different syntax, same root cause: unsanitized user input
- Database choice affects both architecture and attack surface — know what you are running and how it handles untrusted input
