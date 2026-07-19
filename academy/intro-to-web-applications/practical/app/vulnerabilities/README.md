# Vulnerabilities

Three vulnerable versions of endpoints, isolated here for demonstration — not wired into the running app. Each folder pairs the broken code with a `VULNERABILITY.md` explaining the exploit and pointing to the actual patched implementation in `app/`.

| Vulnerability                                           | Patched in                        |
| ------------------------------------------------------- | --------------------------------- |
| [Broken Authentication](./broken-auth/VULNERABILITY.md) | `app/routes/auth.js`              |
| [IDOR](./idor/VULNERABILITY.md)                         | `app/routes/auth.js` (`/me`)      |
| [Mass Assignment](./mass-assignment/VULNERABILITY.md)   | `app/routes/auth.js` (`register`) |
