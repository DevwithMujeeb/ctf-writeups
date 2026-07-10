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

**HTTP (plaintext) — what an attacker on the network sees:**

An attacker performing a man-in-the-middle attack on HTTP traffic sees the full request body including `username=admin&password=supersecret123` in plain text.

**HTTPS (encrypted) — what an attacker sees:**

Unreadable encrypted data — useless without the session key.

**Useful cURL commands for HTTPS testing:**

`curl https://example.com` — standard HTTPS request. `curl -k https://example.com` — skip certificate verification (testing only, never production). `curl --cacert ca.crt https://example.com` — use a custom CA certificate. `openssl s_client -connect example.com:443` — inspect full TLS certificate details.

**Why this matters for AppSec/CTF:**

- Mixed content (HTTPS page loading HTTP resources) is a vulnerability — HTTP resources can be intercepted
- TLS certificates reveal subdomains, organization details, and infrastructure — always inspect during recon
- Self-signed certificates are common in CTF environments — `curl -k` bypasses verification for testing
- Missing HSTS (HTTP Strict Transport Security) header is a finding — its absence enables protocol downgrade attacks

---

## Key Takeaways — Section 1

- HTTP is stateless — cookies, sessions, and tokens exist to work around this
- Every URL component is a potential attack surface — test parameters, paths, and credentials
- HTTPS encrypts data in transit but does not make an application secure — it only prevents network-level interception
- TLS certificates leak subdomain and infrastructure information — always check during recon
- `curl -k` bypasses certificate verification — useful during CTF but dangerous in production
