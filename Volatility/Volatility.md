# Pretext

Volatility is a powerful memory forensics framework used to analyze RAM dumps.  
It allows us to extract processes, network connections, credentials, and other artifacts from a memory image.

---

# Basic Usage

Volatility has two main versions with slightly different syntax.

```bash
# Volatility 2
vol.py -f <memory.img> --profile=<PROFILE> <plugin>

# Volatility 3
vol -f <memory.img> <plugin>
```

### Examples

```bash
vol.py -f mem.raw --profile=Win7SP1x64 pslist
vol.py -f mem.raw --profile=Win7SP1x64 netscan

vol -f mem.raw windows.pslist
vol -f mem.raw windows.netscan
```

|Argument|Description|
|---|---|
|`-f`|Memory image file|
|`--profile`|Target OS profile (Volatility 2)|
|`<plugin>`|Module to run|

---

# Initial Enumeration

Just like normal enumeration, we start by identifying the target.

```bash
# Volatility 2
vol.py -f mem.raw imageinfo
vol.py -f mem.raw kdbgscan

# Volatility 3
vol -f mem.raw windows.info
```

This helps determine:

- OS version
- Architecture
- Suggested profiles

---

# Process Enumeration

We can enumerate running and hidden processes.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 pslist
vol.py -f mem.raw --profile=Win7SP1x64 psscan
vol.py -f mem.raw --profile=Win7SP1x64 pstree
vol.py -f mem.raw --profile=Win7SP1x64 psxview
```

| Plugin  | Description                           |
| ------- | ------------------------------------- |
| pslist  | Active processes                      |
| psscan  | Finds hidden/terminated processes     |
| pstree  | Process hierarchy                     |
| psxview | Detect hidden processes (cross-check) |

---

# Network Enumeration

We can identify active and past network connections.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 netscan
vol.py -f mem.raw --profile=Win7SP1x64 connscan
```

| Plugin   | Description           |
| -------- | --------------------- |
| netscan  | Active connections    |
| connscan | Older connection scan |

---

# Memory Injection / Malware Detection

We can search for suspicious memory regions.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 malfind
vol.py -f mem.raw --profile=Win7SP1x64 yarascan -Y rules.yar
```

| Plugin   | Description                 |
| -------- | --------------------------- |
| malfind  | Detect injected code        |
| yarascan | Scan memory with YARA rules |

---

# Dumping Memory & Files

We can extract processes, DLLs, and files.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 memdump -p <PID> -D ./dumps
vol.py -f mem.raw --profile=Win7SP1x64 procdump -p <PID> -D ./dumps
vol.py -f mem.raw --profile=Win7SP1x64 dlldump -p <PID> -D ./dlls
```

---

# File Enumeration

We can locate and extract files from memory.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 filescan
vol.py -f mem.raw --profile=Win7SP1x64 dumpfiles -Q <OFFSET> -D ./extracted
```

---

# Registry Enumeration

Registry artifacts often contain persistence mechanisms.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 hivelist
vol.py -f mem.raw --profile=Win7SP1x64 printkey -o <OFFSET> -K "\Software\Microsoft\Windows\CurrentVersion\Run"
```

|Plugin|Description|
|---|---|
|hivelist|Lists registry hives|
|printkey|Dumps registry keys|

---

# User Activity

We can extract user behavior artifacts.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 cmdline
vol.py -f mem.raw --profile=Win7SP1x64 userassist
vol.py -f mem.raw --profile=Win7SP1x64 clipboard
```

---

# Timeline Creation

We can build a timeline of system activity.

```bash
vol.py -f mem.raw --profile=Win7SP1x64 mftparser --output=bodyfile > timeline.body
mactime -b timeline.body -d > timeline.csv
```

---

# LSASS Dump (Credentials)

Used for credential extraction (ONLY with authorization).

```bash
vol.py -f mem.raw --profile=Win7SP1x64 procdump -p <LSASS_PID> -D ./dumps
```

---

# VMware (`.vmem`) Analysis

VMware memory requires extra steps.

### Identify layers

```bash
vol -f snapshot.vmem vmscan
```

### Get system info

```bash
vol -f snapshot.vmem windows.info
```

### Run plugins

```bash
vol -f snapshot.vmem windows.pslist
vol -f snapshot.vmem windows.netscan
```

### Convert if needed

```bash
vmss2core -W snapshot.vmem snapshot.vmss
vol -f snapshot.vmem.core windows.info
```

---
