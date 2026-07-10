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

**Request line:** Contains the HTTP method, the path being requested, and the HTTP version — for example `GET /index.html HTTP/1.1`.

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

HTTP methods define the type of action being requested. Each method has a specific intended purpose — and security implications when misused or when servers don't properly restrict which methods are allowed.

| Method    | Purpose                          | Has body? | Security notes                                         |
| --------- | -------------------------------- | --------- | ------------------------------------------------------ |
| `GET`     | Retrieve a resource              | No        | Parameters in URL — visible in logs, history, referrer |
| `POST`    | Submit data to the server        | Yes       | Most common injection target                           |
| `PUT`     | Replace a resource entirely      | Yes       | If unauthenticated, can overwrite arbitrary files      |
| `PATCH`   | Partially update a resource      | Yes       | Same risks as PUT                                      |
| `DELETE`  | Delete a resource                | No        | Missing auth = anyone can delete anything              |
| `HEAD`    | Same as GET but no response body | No        | Useful for recon — reveals headers without body        |
| `OPTIONS` | List supported methods           | No        | Reveals what the server allows                         |
| `TRACE`   | Echo the request back            | No        | Can be used in Cross-Site Tracing (XST) attacks        |

Always check what methods a server allows: `curl -X OPTIONS https://target.com -i` — the response `Allow` header lists every permitted method. Finding `PUT` or `DELETE` on a path that shouldn't support them is a significant finding.

### HTTP Status Codes

| Range | Class         | What it means during testing                                                    |
| ----- | ------------- | ------------------------------------------------------------------------------- |
| 1xx   | Informational | Request received and processing                                                 |
| 2xx   | Success       | Request worked — `200 OK`, `201 Created`, `204 No Content`                      |
| 3xx   | Redirection   | `301` permanent, `302` temporary — test redirect params for open redirect       |
| 4xx   | Client errors | `401` needs auth, `403` exists but blocked, `404` not found, `429` rate limited |
| 5xx   | Server errors | `500` something broke — a signal when testing injection                         |

**Key distinctions:** A `403` means the resource exists and is protected — worth investigating for bypass techniques. A `500` response to a crafted input means your payload caused unexpected behaviour — investigate further. During directory brute-forcing, filtering by status code is how you cut through noise and find what matters.

---

## 6. GET Requests

GET is the most common HTTP method — used to retrieve resources without modifying server state. All parameters travel in the URL query string, making them visible in browser history, server logs, proxy logs, and the `Referer` header of any subsequent request.

**GET request anatomy:** The method, path, and query string all appear on the first line — `GET /search?query=test&page=1 HTTP/1.1` — followed by headers, with no request body.

**cURL GET examples:** `curl https://target.com` sends a basic GET. `curl "https://target.com/api/users?id=1"` sends a GET with a query parameter. `curl -v https://target.com` shows the full request and response in verbose mode. `curl -H "Authorization: Bearer eyJ..." https://target.com/api/profile` sends a GET with an auth header.

### GET security implications

**Parameter tampering:** Since GET parameters are in the URL, they're trivially easy to modify. `?id=1` becomes `?id=2`, `?id=admin`, `?id=1 OR 1=1`. Every GET parameter is a potential IDOR, SQLi, or XSS injection point.

**Information leakage:** GET parameters appear in server access logs, browser history, bookmarks, and the `Referer` header. Sensitive data — session tokens, API keys, personal information — should never travel in GET parameters.

**Caching:** GET responses are often cached by browsers and proxies. This can expose sensitive data to other users on shared systems, or allow stale data to persist longer than intended.

**Why this matters for CTF:** During web application testing, GET parameters are the first place to probe. Change `?id=1` to `?id=2` immediately — if you get another user's data, that's IDOR. Add a single quote (`?id=1'`) and watch for a 500 — that's a signal for SQLi. Inject `?name=<script>alert(1)</script>` and check if it reflects — that's reflected XSS.

---

## 7. POST Requests

POST is used to submit data to the server — creating resources, triggering actions, submitting forms, and authenticating users. Unlike GET, the data travels in the request body rather than the URL, making it slightly less visible — but not more secure.

**POST request anatomy:** The method and path appear on the first line (`POST /api/login HTTP/1.1`), followed by headers including `Content-Type` to tell the server how to parse the body, then a blank line, then the body itself.

**Common POST body formats:**

JSON (most common for APIs): body is `{"username":"admin","password":"secret"}` with `Content-Type: application/json` header.

Form data (HTML forms): body is `username=admin&password=secret` with `Content-Type: application/x-www-form-urlencoded` header.

Multipart (file uploads): used when uploading files — each part has its own headers and body section, with `Content-Type: multipart/form-data` header.

**cURL POST examples:** `curl -X POST https://target.com/api/login -H "Content-Type: application/json" -d '{"username":"admin","password":"secret"}'` sends a JSON POST. `curl -X POST https://target.com/login -d "username=admin&password=secret"` sends form data. `curl -X POST https://target.com/upload -F "file=@shell.php"` uploads a file.

### POST security implications

**POST does not mean secure:** A common misconception is that POST is more secure than GET because parameters don't appear in the URL. The body is still readable by anyone who can intercept the traffic — HTTPS is what provides confidentiality, not the method.

**Content-Type switching:** Changing the `Content-Type` header from `application/x-www-form-urlencoded` to `application/json` (or vice versa) sometimes bypasses input validation that was only written for one format. Worth trying when you hit a wall.

**File upload abuse:** POST endpoints that accept file uploads are a major attack surface. If the server doesn't validate file type properly, uploading a PHP shell (`shell.php`) and then accessing it via the browser gives remote code execution. Always test upload endpoints for extension bypass (`shell.php.jpg`, `shell.pHp`, null byte injection `shell.php%00.jpg`).

**Mass assignment:** If a POST body is directly mapped to a database model without filtering, adding extra fields (`"role":"admin"`) can sometimes set fields the developer didn't intend to expose. This is the mass assignment vulnerability — check what fields the server actually processes vs what it documents.

---

## 8. CRUD APIs

CRUD (Create, Read, Update, Delete) is the standard pattern for REST APIs. Each operation maps to an HTTP method, and each endpoint represents a resource. Understanding this mapping is essential for API security testing — because each operation has a distinct set of security concerns.

### CRUD to HTTP method mapping

| CRUD Operation   | HTTP Method | Endpoint example      | Expected response |
| ---------------- | ----------- | --------------------- | ----------------- |
| Create           | `POST`      | `POST /api/users`     | `201 Created`     |
| Read (all)       | `GET`       | `GET /api/users`      | `200 OK` + list   |
| Read (one)       | `GET`       | `GET /api/users/1`    | `200 OK` + object |
| Update (full)    | `PUT`       | `PUT /api/users/1`    | `200 OK` or `204` |
| Update (partial) | `PATCH`     | `PATCH /api/users/1`  | `200 OK` or `204` |
| Delete           | `DELETE`    | `DELETE /api/users/1` | `200 OK` or `204` |

### API security testing methodology

**Step 1 — Enumerate endpoints.** APIs often have predictable structures. If you find `/api/users/1`, try `/api/users/2`, `/api/admin`, `/api/users/1/settings`. Directory brute-forcing with an API-focused wordlist (SecLists has several) reveals hidden endpoints.

**Step 2 — Test every CRUD operation on every endpoint.** Just because the documentation says an endpoint only supports GET doesn't mean the server enforces it. Try POST, PUT, DELETE. Unexpected method support is a significant finding.

**Step 3 — Test authorization on every endpoint.** The most common API vulnerability is broken object-level authorization (BOLA/IDOR) — accessing another user's resources by changing an ID. `GET /api/users/1` as user 2 should return 403, not user 1's data.

**Step 4 — Test authentication bypass.** Remove the `Authorization` header entirely. Change `Bearer token` to `Bearer null` or `Bearer undefined`. Try accessing endpoints without any credentials. APIs that return data without authentication are a critical finding.

**Step 5 — Fuzz input fields.** Every field in a POST/PUT body is a potential injection point. Test for SQLi, XSS, command injection, SSRF, and XXE depending on context.

**cURL for API testing:** `curl https://target.com/api/users` reads all users. `curl https://target.com/api/users/1` reads user 1. `curl -X POST https://target.com/api/users -H "Content-Type: application/json" -d '{"name":"test","email":"test@test.com"}'` creates a user. `curl -X PUT https://target.com/api/users/1 -H "Content-Type: application/json" -d '{"name":"updated"}'` updates user 1. `curl -X DELETE https://target.com/api/users/1` deletes user 1.

### Common API vulnerabilities

**BOLA (Broken Object Level Authorization) / IDOR:** Accessing another user's object by changing an ID in the URL or body. The most prevalent API vulnerability — test every ID parameter.

**Broken Function Level Authorization:** Regular users accessing admin-only endpoints. Try `/api/admin`, `/api/users/1/promote`, `/api/settings` without admin credentials.

**Mass Assignment:** Sending extra fields in POST/PUT bodies that get processed by the server — `"role":"admin"`, `"isAdmin":true`, `"balance":999999`.

**Excessive Data Exposure:** APIs returning more data than the UI displays — the frontend hides sensitive fields but the raw API response includes them. Always read the full response body, not just what the browser renders.

**Rate Limiting Absence:** No throttling on authentication endpoints — enables brute force. Test by sending 50 rapid requests and checking if any get blocked.

---

## Key Takeaways — Full Module

- HTTP is stateless — cookies, sessions, and tokens exist to work around this
- Every URL component is a potential attack surface — test parameters, paths, and credentials
- HTTPS encrypts data in transit but does not make an application secure — HTTPS + secure code is required
- TLS certificates leak subdomain and infrastructure information — always check during recon
- The request body is where injection attacks live — test every input field on every endpoint
- Response headers reveal the technology stack — check every version string against CVE databases
- Missing security headers are findings — always run `curl -I https://target.com` early in any assessment
- Cookies without `HttpOnly` are vulnerable to XSS-based session theft
- Always check allowed HTTP methods with OPTIONS — unexpected PUT or DELETE are findings
- A `403` response means the resource exists and is protected — investigate for bypass
- A `500` response to a crafted input means something broke — investigate further
- GET parameters are trivially modified — test every one for IDOR, SQLi, and XSS immediately
- POST does not mean secure — HTTPS provides confidentiality, not the method
- Content-Type switching sometimes bypasses input validation — always try it
- File upload endpoints are high-value targets — always test for extension bypass
- BOLA/IDOR is the most common API vulnerability — test every ID parameter
- Always read the full raw API response — the frontend hides fields the API still returns
- Remove the Authorization header entirely on every endpoint — unauthenticated access is a critical finding

---

## Resources

- [HackTheBox Academy — Web Requests](https://academy.hackthebox.com/module/details/35)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [SecLists — API wordlists](https://github.com/danielmiessler/SecLists)
- [My Web Requests notes (open source)](https://github.com/DevwithMujeeb/ctf-writeups)
