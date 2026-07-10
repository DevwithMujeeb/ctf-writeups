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

A typical POST request has the method and path on the first line (`POST /api/login HTTP/1.1`), followed by headers (`Host: example.com`, `Content-Type: application/json`, `Cookie: session=abc123`), a blank line, then the body (`{"email":"user@example.com","password":"secret"}`).

**Why this matters for AppSec/CTF:**

- The request body is where injection attacks live — SQLi, XSS, command injection, XXE
- The `Host` header can be manipulated for Host header injection attacks
- Cookie headers carry session tokens — target of session hijacking
- `Content-Type` tells the server how to parse the body — changing it can sometimes bypass input validation

### HTTP Response Structure

Every HTTP response has a status line, headers, and optionally a body.

**Status line:** Contains the HTTP version, the status code, and a reason phrase — for example `HTTP/1.1 200 OK`.

**Response headers:** Key-value pairs describing the response — content type, caching rules, security headers, cookies being set, and more.

**Response body:** The actual content returned — HTML, JSON, an image, a file, etc.

**Why this matters for AppSec/CTF:**

- Response headers reveal the technology stack — `Server: Apache/2.4.49` tells you the exact version to check for CVEs
- Missing security headers are findings
- `Set-Cookie` without `HttpOnly` means JavaScript can steal the cookie
- Error responses often leak sensitive information — stack traces, file paths, database errors

---

## 4. HTTP Headers

HTTP headers are key-value pairs that travel with every request and response. From a security perspective, headers are one of the most information-rich parts of an HTTP exchange.

### Request Headers

| Header            | Purpose                             | Security relevance                         |
| ----------------- | ----------------------------------- | ------------------------------------------ |
| `Host`            | Specifies the target domain         | Host header injection                      |
| `User-Agent`      | Identifies the client               | Can be spoofed for fingerprinting bypass   |
| `Authorization`   | Carries authentication credentials  | Bearer tokens, Basic auth                  |
| `Cookie`          | Sends stored cookies to the server  | Session tokens — target of XSS             |
| `Content-Type`    | Tells the server the body format    | Changing can bypass input validation       |
| `Referer`         | The page that triggered the request | Can leak sensitive URLs                    |
| `X-Forwarded-For` | Original IP behind a proxy          | Can be spoofed to bypass IP-based controls |

### Response Headers

| Header                        | Purpose                            | Security relevance                                    |
| ----------------------------- | ---------------------------------- | ----------------------------------------------------- |
| `Server`                      | Identifies the web server software | Leaks version info                                    |
| `Set-Cookie`                  | Sets a cookie on the client        | Missing `HttpOnly`/`Secure` flags are vulnerabilities |
| `X-Frame-Options`             | Controls iframe embedding          | Missing = clickjacking vulnerability                  |
| `Content-Security-Policy`     | Defines allowed resource sources   | Missing or weak CSP enables XSS                       |
| `X-Content-Type-Options`      | Prevents MIME sniffing             | Should always be `nosniff`                            |
| `Strict-Transport-Security`   | Forces HTTPS                       | Missing = protocol downgrade possible                 |
| `Access-Control-Allow-Origin` | CORS policy                        | Wildcard with credentials = CORS misconfiguration     |

The fastest way to check all response headers: `curl -I https://target.com` — sends a HEAD request and prints only headers, no body.

---

## 5. HTTP Methods & Status Codes

### HTTP Methods

HTTP methods (also called verbs) define the type of action being requested. Each method has a specific intended purpose — and security implications when misused or when servers don't properly restrict which methods are allowed.

| Method    | Purpose                                      | Has body? | Security notes                                                       |
| --------- | -------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `GET`     | Retrieve a resource                          | No        | Parameters in URL — visible in logs, history, referrer               |
| `POST`    | Submit data to the server                    | Yes       | Creates resources, triggers actions — most common injection target   |
| `PUT`     | Replace a resource entirely                  | Yes       | If unauthenticated, can overwrite arbitrary files                    |
| `PATCH`   | Partially update a resource                  | Yes       | Same risks as PUT                                                    |
| `DELETE`  | Delete a resource                            | No        | Missing auth = anyone can delete anything                            |
| `HEAD`    | Same as GET but no response body             | No        | Useful for recon — reveals headers without downloading body          |
| `OPTIONS` | List supported methods for a resource        | No        | Reveals what the server allows — useful during recon                 |
| `TRACE`   | Echo the request back                        | No        | Can be used in Cross-Site Tracing (XST) attacks — should be disabled |
| `CONNECT` | Establish a tunnel (used for HTTPS proxying) | No        | Can be abused to proxy traffic through a server                      |

**Why methods matter for AppSec/CTF:**

Servers should only allow the methods they actually need. A static website should only allow `GET` and `HEAD`. An API endpoint that only reads data should never allow `PUT` or `DELETE`. When a server allows more methods than it should, attackers can abuse the extras.

Always check what methods a server allows: `curl -X OPTIONS https://target.com -i` — the response will include an `Allow` header listing every permitted method. Finding `PUT` or `DELETE` on a path that shouldn't support them is a significant finding.

**Method override abuse:** Some frameworks support `X-HTTP-Method-Override` or `_method` parameters that let a POST request pretend to be a PUT or DELETE. This exists for legacy clients that can't send certain methods — but if not properly validated, it can be abused to perform actions the server thinks it's restricting.

### HTTP Status Codes

Status codes tell the client what happened with their request. They are grouped into five classes — and each class tells a different story during security testing.

**1xx — Informational:** The request was received and is being processed. Rarely seen in normal web testing.

**2xx — Success:** The request was received, understood, and accepted.

| Code             | Meaning                      | Security notes                              |
| ---------------- | ---------------------------- | ------------------------------------------- |
| `200 OK`         | Request succeeded            | Standard success                            |
| `201 Created`    | Resource was created         | Confirms a POST/PUT succeeded               |
| `204 No Content` | Success but no body returned | Common on DELETE — confirms deletion worked |

**3xx — Redirection:** The client must take additional action to complete the request.

| Code                    | Meaning                            | Security notes                                                |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `301 Moved Permanently` | Resource moved — update your links | Redirect target can reveal internal structure                 |
| `302 Found`             | Temporary redirect                 | Open redirect vulnerability if destination is user-controlled |
| `304 Not Modified`      | Cached version is still valid      |                                                               |

**Open redirect** is a common vulnerability where `?redirect=https://evil.com` causes the server to redirect users to an attacker-controlled site. Always test redirect parameters.

**4xx — Client Errors:** The request was malformed or unauthorized.

| Code                     | Meaning                          | Security notes                                                    |
| ------------------------ | -------------------------------- | ----------------------------------------------------------------- |
| `400 Bad Request`        | Malformed request                | Useful for fuzzing — unexpected 400s reveal input handling        |
| `401 Unauthorized`       | Authentication required          | No valid credentials provided                                     |
| `403 Forbidden`          | Authenticated but not authorized | Access control is enforced — try to bypass                        |
| `404 Not Found`          | Resource doesn't exist           | Directory brute-forcing relies on distinguishing 404 from 200/403 |
| `405 Method Not Allowed` | HTTP method not permitted        | Confirms the method restriction — try others                      |
| `429 Too Many Requests`  | Rate limited                     | Confirms rate limiting is in place                                |

**The difference between 401 and 403 matters:** A `401` means "who are you?" — you need to authenticate. A `403` means "I know who you are, but you can't do this" — you're authenticated but not authorized. Getting a `403` on a path tells you it exists and is protected — worth investigating for bypass techniques.

**5xx — Server Errors:** The server failed to fulfill a valid request.

| Code                        | Meaning                       | Security notes                                                         |
| --------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `500 Internal Server Error` | Something broke on the server | Often triggered by injection — a 500 response to a payload is a signal |
| `502 Bad Gateway`           | Upstream server error         | Reveals proxy/load balancer architecture                               |
| `503 Service Unavailable`   | Server overloaded or down     |                                                                        |

**A 500 response to a crafted input is one of the most useful signals in web security testing.** It means your input reached the server, caused unexpected behaviour, and broke something. It doesn't always mean you've found a vulnerability — but it means you've found an error condition worth investigating further.

### cURL for method and status code testing

`curl -X GET https://target.com` — explicit GET request. `curl -X POST https://target.com/api -d '{"key":"value"}' -H "Content-Type: application/json"` — POST with JSON body. `curl -X OPTIONS https://target.com -i` — check allowed methods. `curl -I https://target.com` — HEAD request, see only response headers and status code. `curl -v https://target.com` — verbose mode, see full request and response including headers.

**Why status codes matter during CTF enumeration:**

When directory brute-forcing with gobuster or ffuf, you're looking for responses that differ from the baseline. A `200` or `301` on a path you guessed means it exists. A `403` means it exists but is protected. A `404` means it doesn't exist. Filtering by status code is how you cut through noise and find what matters.

---

## Key Takeaways — Sections 1-3

- HTTP is stateless — cookies, sessions, and tokens exist to work around this
- Every URL component is a potential attack surface — test parameters, paths, and credentials
- HTTPS encrypts data in transit but does not make an application secure
- TLS certificates leak subdomain and infrastructure information — always check during recon
- The request body is where injection attacks live — always test every input field
- Response headers reveal the technology stack — check every version string against CVE databases
- Missing security headers are findings — always run `curl -I https://target.com` early in any assessment
- Cookies without `HttpOnly` are vulnerable to XSS-based session theft
- Always check allowed HTTP methods with OPTIONS — unexpected methods like PUT or DELETE are findings
- A `403` response means the resource exists and is protected — worth investigating for bypass
- A `500` response to a crafted input means something broke — investigate further
- Status code differences during directory brute-forcing are how you find hidden content
