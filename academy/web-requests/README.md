# Web Requests — HackTheBox Academy

**Module:** Web Requests
**Platform:** HackTheBox Academy
**Status:** ✅ Completed
**Completed:** July 2026

---

## Overview

Web Requests covers how browsers and applications communicate with servers over HTTP — the foundation of every web application, API, and web-based attack. Coming from a backend development background, most of these concepts were already familiar — this module reframes them through a security lens, which changes how you think about them entirely.

A developer thinks about HTTP as a transport mechanism. A security engineer thinks about HTTP as an attack surface.

---

## 1. HTTP Fundamentals

HTTP (HyperText Transfer Protocol) is an application-layer protocol used for transmitting data between a client and a server. It is the foundation of data communication on the web.

HTTP is a **stateless** protocol — each request is independent. The server retains no information about previous requests from the same client. This is why session tokens, cookies, and JWTs exist — they are mechanisms built on top of HTTP to simulate state.

Default ports: HTTP uses port **80**, HTTPS uses port **443**.

**Basic flow:** Client sends an HTTP Request → Server processes it → Server sends an HTTP Response back to the client.

### URL Structure

A URL (Uniform Resource Locator) is the full address used to access a resource on the web. Every component is a potential attack surface.

`http://user:password@example.com:80/path/to/resource?key=value&key2=value2#fragment`

| Component    | Example             | Description                               |
| ------------ | ------------------- | ----------------------------------------- |
| Scheme       | `http://`           | Protocol being used                       |
| Credentials  | `user:password@`    | Optional — basic auth credentials         |
| Host         | `example.com`       | Domain name or IP address                 |
| Port         | `:80`               | Optional — defaults to 80/443             |
| Path         | `/path/to/resource` | Resource location on the server           |
| Query string | `?key=value`        | Parameters passed to the server           |
| Fragment     | `#fragment`         | Client-side anchor — never sent to server |

**Why this matters for AppSec/CTF:**

- Credentials in URLs appear in logs, browser history, and referrer headers — a common misconfiguration
- Query string parameters (`?id=1`) are the most common injection point — always test for SQLi, XSS, IDOR
- The fragment (`#`) is never sent to the server — useful when testing client-side vs server-side behaviour

---

## 2. HTTPS — The Secure Version

HTTPS (HTTP Secure) is HTTP with an additional encryption layer provided by **TLS** (Transport Layer Security) — the modern successor to SSL.

Without HTTPS, all HTTP traffic travels in plaintext. Anyone on the same network can read every request and response — including credentials, session tokens, and sensitive data.

HTTPS solves this by encrypting data in transit, authenticating the server via TLS certificate, and ensuring data integrity — nothing can be modified in transit without detection.

An attacker performing a man-in-the-middle attack on HTTP traffic sees the full request body including credentials in plain text. With HTTPS, they see only unreadable encrypted data — useless without the session key.

**Useful cURL commands for HTTPS testing:** `curl https://example.com` for a standard request, `curl -k https://example.com` to skip certificate verification (testing only), `curl --cacert ca.crt https://example.com` to use a custom CA certificate, and `openssl s_client -connect example.com:443` to inspect full TLS certificate details.

**Why this matters for AppSec/CTF:**

- Mixed content (HTTPS page loading HTTP resources) is a vulnerability — HTTP resources can be intercepted
- TLS certificates reveal subdomains, organization details, and infrastructure — always inspect during recon
- Self-signed certificates are common in CTF environments — `curl -k` bypasses verification for testing
- Missing HSTS header is a finding — its absence enables protocol downgrade attacks

---

## 3. HTTP Requests & Responses

### HTTP Request Structure

Every HTTP request has the same fundamental structure — a method, a path, headers, and optionally a body.

**Request line:** Contains the HTTP method, the path being requested, and the HTTP version. For example: `GET /index.html HTTP/1.1`

**Request headers:** Key-value pairs that provide additional context about the request — who's sending it, what format they accept, what cookies they have, and more.

**Request body:** Optional — only present on methods that send data (POST, PUT, PATCH). Contains the actual data being submitted, formatted as JSON, form data, or multipart.

**A typical POST request looks like this:**

Method and path on the first line: `POST /api/login HTTP/1.1`. Then headers: `Host: example.com`, `Content-Type: application/json`, `Content-Length: 39`, `Cookie: session=abc123`. Then a blank line, then the body: `{"email":"user@example.com","password":"secret"}`.

**Why this matters for AppSec/CTF:**

- The request body is where injection attacks live — SQLi, XSS, command injection, XXE
- The `Host` header can be manipulated for Host header injection attacks
- Cookie headers carry session tokens — if unprotected, they're the target of session hijacking
- `Content-Type` tells the server how to parse the body — changing it can sometimes bypass input validation

### HTTP Response Structure

Every HTTP response has a status line, headers, and optionally a body.

**Status line:** Contains the HTTP version, the status code, and a reason phrase. For example: `HTTP/1.1 200 OK`.

**Response headers:** Key-value pairs describing the response — content type, caching rules, security headers, cookies being set, and more.

**Response body:** The actual content returned — HTML, JSON, an image, a file, etc.

**A typical JSON API response looks like this:**

Status line: `HTTP/1.1 200 OK`. Headers: `Content-Type: application/json`, `Set-Cookie: session=xyz789; HttpOnly; Secure`, `X-Content-Type-Options: nosniff`. Then the body: `{"message":"Login successful","token":"eyJ..."}`.

**Why this matters for AppSec/CTF:**

- Response headers reveal the technology stack — `Server: Apache/2.4.49` tells you the exact version to check for CVEs
- Missing security headers (`X-Frame-Options`, `Content-Security-Policy`, `X-Content-Type-Options`) are findings
- `Set-Cookie` without `HttpOnly` means JavaScript can steal the cookie — XSS becomes session hijacking
- `Set-Cookie` without `Secure` means the cookie is sent over HTTP — interception risk
- Error responses often leak sensitive information — stack traces, file paths, database errors

---

## 4. HTTP Headers

HTTP headers are key-value pairs that travel with every request and response. They control caching, authentication, content negotiation, security policies, and more. From a security perspective, headers are one of the most information-rich parts of an HTTP exchange.

### Request Headers

| Header            | Purpose                              | Security relevance                                        |
| ----------------- | ------------------------------------ | --------------------------------------------------------- |
| `Host`            | Specifies the target domain          | Host header injection — can redirect server-side requests |
| `User-Agent`      | Identifies the client (browser/tool) | Often used for fingerprinting — can be spoofed            |
| `Authorization`   | Carries authentication credentials   | Bearer tokens, Basic auth — primary auth mechanism        |
| `Cookie`          | Sends stored cookies to the server   | Session tokens — target of XSS and session hijacking      |
| `Content-Type`    | Tells the server the body format     | Changing this can bypass input validation                 |
| `Referer`         | The page that triggered the request  | Can leak sensitive URLs — disabled by Referrer-Policy     |
| `X-Forwarded-For` | Original IP behind a proxy           | Can be spoofed to bypass IP-based access controls         |

### Response Headers

| Header                        | Purpose                                     | Security relevance                                      |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------- |
| `Server`                      | Identifies the web server software          | Leaks version info — check against CVE databases        |
| `Set-Cookie`                  | Sets a cookie on the client                 | Missing `HttpOnly`/`Secure` flags are vulnerabilities   |
| `Content-Type`                | Tells the client how to render the response | Wrong type can cause MIME sniffing attacks              |
| `X-Frame-Options`             | Controls iframe embedding                   | Missing = clickjacking vulnerability                    |
| `Content-Security-Policy`     | Defines allowed resource sources            | Missing or weak CSP enables XSS                         |
| `X-Content-Type-Options`      | Prevents MIME sniffing                      | Should always be set to `nosniff`                       |
| `Strict-Transport-Security`   | Forces HTTPS                                | Missing = protocol downgrade possible                   |
| `Access-Control-Allow-Origin` | CORS policy                                 | Wildcard (`*`) with credentials = CORS misconfiguration |

### Security headers checklist

When testing a web application, always check for the presence and correct configuration of these response headers. Missing or misconfigured security headers are low-hanging fruit in any security assessment.

The fastest way to check all headers at once: `curl -I https://target.com` — the `-I` flag sends a HEAD request and prints only the response headers, no body. This immediately shows what's present and what's missing.

**Why headers matter in CTF specifically:**

- Version disclosure in `Server` or `X-Powered-By` headers reveals exploitable software versions
- Weak or missing `Content-Security-Policy` means XSS payloads will execute
- `X-Forwarded-For` spoofing can bypass IP whitelists on admin panels
- Cookies without `HttpOnly` are readable by JavaScript — confirm this before attempting XSS for session theft

---

## Key Takeaways — Sections 1-2

- HTTP is stateless — cookies, sessions, and tokens exist to work around this
- Every URL component is a potential attack surface — test parameters, paths, and credentials
- HTTPS encrypts data in transit but does not make an application secure — it only prevents network-level interception
- TLS certificates leak subdomain and infrastructure information — always check during recon
- The request body is where injection attacks live — always test every input field
- Response headers reveal the technology stack — check every version string against CVE databases
- Missing security headers are findings — always run `curl -I https://target.com` early in any assessment
- Cookies without `HttpOnly` are vulnerable to XSS-based session theft
- `X-Forwarded-For` can be spoofed — never trust it for access control decisions
