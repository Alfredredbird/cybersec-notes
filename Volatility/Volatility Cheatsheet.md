# Volatility Cheatsheet

> Quick reference for memory forensics using **Volatility** (mainly Volatility 2-style syntax). Covers common workflow, plugins, examples, and quick tips. Adapt `--profile` / plugin names for your target image and Volatility version.

---

## 1 — Basic usage patterns

```bash
# Volatility 2 (classic):
vol.py -f <memory.img> --profile=<PROFILE> <plugin> [options]

# Examples:
vol.py -f mem.raw --profile=Win7SP1x64 pslist
vol.py -f mem.raw --profile=Win7SP1x64 netscan

# Volatility 3 (API / new layout) — generic form (note: exact invocation may depend on install):
vol -f <memory.img> <plugin> [--output json] [--plugin-args]
```

Replace `<memory.img>` and `<PROFILE>` with your file and target OS profile (WinXPSP2x86, Win7SP1x64, Win10x64_15041, etc.).

---

## 2 — Quick workflow (investigation checklist)

1. Identify image metadata
    
    - `imageinfo` / `kdbgscan` / `windows.info` (Vol3)
        
2. Acquire profile / architecture
    
3. Basic process enumeration (pslist, psscan, pstree)
    
4. Cross-check with hidden process checks (`psxview`) and `psscan`
    
5. Network artifacts: `netscan`, `connscan`, `sockets`
    
6. Suspicious memory: `malfind`, `yarascan`, `apihooks`
    
7. Dump process memory and modules (memdump, procdump, dlldump)
    
8. Files & filesystem artifacts: `filescan`, `dumpfiles`, `timeliner`/`mftparser`/`shellbags` (as available)
    
9. Registry artifacts: `hivelist`, `hivedump`, `printkey`; parse Run keys, userassist, shimcache
    
10. Browser, credential, and persistence checks: `iehistory`, `cookies`, `wlan`, `lsass` dump
    
11. Create timeline (using `timeconv` + events or external tools)
    

---

## 3 — High-value plugins & what they do

- `imageinfo` — suggests profiles, gives basic info (Vol2)
    
- `kdbgscan` / `kdbg` — kernel debugger block scanning (low-level)
    
- `pslist` — processes from EPROCESS list (normal)
    
- `psscan` — scan for EPROCESS structures (finds terminated/hidden processes)
    
- `pstree` — hierarchical view of processes
    
- `psxview` — cross-view process detection (combines multiple techniques)
    
- `dlllist` — list loaded DLLs per process
    
- `ldrmodules` / `modules` — loaded module lists
    
- `handles` — open handles; useful to find file/network handles
    
- `filescan` — scan for file objects (carving file records)
    
- `dumpfiles` / `procdump` / `memdump` — extract files/process memory
    
- `malfind` — suspicious memory regions (code injections, shells)
    
- `yarascan` — run YARA rules against memory
    
- `apihooks` — detect hooked API in kernel/user space
    
- `netscan` — network connections discovered via kernel structures
    
- `connscan` / `sockscan` — older connection scanning methods
    
- `hivelist` — list registry hive offsets
    
- `hivedump` / `printkey` — dump registry hives / keys
    
- `shimcache` / `svcscan` — persistence and service enumeration
    
- `cmdline` — show full process command lines
    
- `userassist` / `shellbags` / `recentdocs` — user activity
    
- `clipboard` — extract clipboard contents
    
- `sockets` / `netscan` — socket-level info for network analysis
    

---

## 4 — Common example commands

```bash
# Identify suggested profiles / image info
vol.py -f mem.raw imageinfo

# Process listing (normal and scanning)
vol.py -f mem.raw --profile=Win7SP1x64 pslist
vol.py -f mem.raw --profile=Win7SP1x64 psscan
vol.py -f mem.raw --profile=Win7SP1x64 pstree
vol.py -f mem.raw --profile=Win7SP1x64 psxview

# Network
vol.py -f mem.raw --profile=Win7SP1x64 netscan
vol.py -f mem.raw --profile=Win7SP1x64 connscan

# Find injected / suspicious memory regions
vol.py -f mem.raw --profile=Win7SP1x64 malfind
vol.py -f mem.raw --profile=Win7SP1x64 yarascan -Y "rule.yar"

# Dump process memory / extract binaries
vol.py -f mem.raw --profile=Win7SP1x64 memdump -p <PID> -D ./dumps
vol.py -f mem.raw --profile=Win7SP1x64 procdump -p <PID> -D ./dumps
vol.py -f mem.raw --profile=Win7SP1x64 dlldump -p <PID> -D ./dlls

# Registry
vol.py -f mem.raw --profile=Win7SP1x64 hivelist
vol.py -f mem.raw --profile=Win7SP1x64 printkey -o <offset> -K "\Software\Microsoft\Windows\CurrentVersion\Run"

# Filesystem / carving
vol.py -f mem.raw --profile=Win7SP1x64 filescan
vol.py -f mem.raw --profile=Win7SP1x64 dumpfiles -Q <FILEOBJECT_OFFSET> -D ./extracted

# Timeline /timestamps
vol.py -f mem.raw --profile=Win7SP1x64 mftparser --output=bodyfile > timeline.body
mactime -b timeline.body -d > timeline.csv

# LSASS dump (for credential extraction - ensure legal authorization)
vol.py -f mem.raw --profile=Win7SP1x64 procdump -p <LSASS_PID> -D ./sensitive_dumps

# YARA against entire image (carve + scan)
vol.py -f mem.raw --profile=Win7SP1x64 yarascan -Y rules.yar
```

---

## 5 — Tips & tricks

- Always run `imageinfo`/`kdbgscan` first to get the best profile guesses.
    
- Use `psscan` and `psxview` to find hidden/terminated processes; compare results from multiple plugins.
    
- `malfind` is a fast first-pass to find injected code — follow up by dumping the region and running yara/strings.
    
- When dumping `lsass.exe`, be mindful of legal/privacy issues and use secure handling procedures.
    
- Use `yarascan` to hunt for specific malware artifacts (strings, patterns) — have curated YARA rules.
    
- Combine Volatility output with other tools (strings, radare2, IDA, VirusTotal) for deeper analysis.
    
- Timestamp conversions: Volatility outputs Windows FILETIME in many places; use `timeconv` or OS tools to convert.
    
- For unstable images, try multiple image acquisition tools and verify MD5/SHA256.
    

---

## 6 — Common pitfalls

- Wrong `--profile` leads to garbage output. If unsure, test multiple close profiles or use Vol3's automatic metadata discovery.
    
- Volatility plugins rely on internal OS structures — some plugins are version/patch-level sensitive.
    
- Memory image with page padding/compressed/partial captures may break plugins. Verify capture quality (e.g., using `strings` to sanity-check).
    

---

## 7 — Quick reference table (plugin → what it finds)

| Plugin                       | Purpose                               |
| ---------------------------- | ------------------------------------- |
| imageinfo / kdbgscan         | Image metadata & profile suggestions  |
| pslist, psscan, pstree       | Process enumeration                   |
| psxview                      | Cross-check / detect hidden processes |
| malfind                      | Suspicious injected code regions      |
| yarascan                     | YARA rule scanning in memory          |
| netscan, connscan            | Network connections                   |
| filescan, dumpfiles          | File objects and extraction           |
| hivelist, printkey, hivedump | Registry extraction                   |
| handles                      | Open handles (files/sockets)          |
| dlllist, dlldump             | Loaded DLLs and extraction            |

---

## 8 — Suggested reading & resources

- Volatility official docs and plugin docs (read the README for your Volatility version).
    
- YARA cheat sheets and example rules.
    
- Memory forensics books (Ligh et al., "The Art of Memory Forensics").
    

---

## 9 — Working with VMware (`.vmem`)

````markdown


Volatility 3 does not include the old `imageinfo` plugin. Use the Vol3 equivalents (`vmscan`, `windows.info`, etc.) and make sure you point Volatility at the correct memory *layer*.

**1) First look for VM layers**
```bash
# scan the image for VM/ram layers and offsets
vol -f snapshot.vmem vmscan
````

`vmscan` will report VMware-specific layer(s) it finds (VMware RAM layer, offsets, page size info). Note the layer names / offsets printed.

**2) Get Windows metadata (Vol3 equivalent of imageinfo)**

```bash
# ask Vol3 for Windows information / suggested symbols
vol -f snapshot.vmem windows.info
```

`windows.info` displays suggested symbol tables, OS details and other metadata Vol3 can use.

**3) If `vmscan` shows multiple layers or Vol3 isn't auto-selecting the right layer, specify the layer/location**  
Vol3 allows you to explicitly provide the memory _location_ / layer. Common approaches:

- Use the file location directly (works for many `.vmem` files):
    

```bash
vol -f snapshot.vmem windows.info
```

- If `vmscan` reported a specific layer or offset, pass a single-location string (replace with the layer/offset shown by your `vmscan` output):
    

```bash
vol -f snapshot.vmem --single-location=file:<absolute_path_to>/snapshot.vmem windows.info
```

(If `vmscan` shows an internal layer name you can use that layer name in the `--single-location` argument — copy exactly as shown.)

**4) If Vol3 fails to handle VMware headers, convert to a raw/core file**  
If `vmscan`/`windows.info` do not work or you see garbage, convert the snapshot to a Linux-core-style raw file first:

```bash
# use vmss2core (VMware tools) to convert .vmem/.vmss into a .core/raw image
vmss2core -W snapshot.vmem snapshot.vmss
# then analyze the produced core
vol -f snapshot.vmem.core windows.info
```

**5) After identification, continue usual Vol3 plugin runs**  
Use `pslist`, `psscan`, `netscan`, `malfind`, etc., against the image once the correct layer/symbols are selected:

```bash
vol -f snapshot.vmem windows.pslist
vol -f snapshot.vmem windows.netscan
vol -f snapshot.vmem windows.malfind
```

**Notes / troubleshooting**

- `imageinfo` is a Volatility 2 plugin — don’t expect it in Vol3. Use `windows.info` (Vol3) instead.
    
- `vmscan` is useful to reveal VMware-specific layers and offsets. Use it first for `.vmem` files.
    
- If the guest is Linux, Vol3 often auto-detects things better; for Windows, you may need to supply the correct symbol table that `windows.info` suggests.
    
- If you’re stuck, paste the `vmscan` output — it usually contains the exact layer name / offset needed to craft `--single-location`.
    
