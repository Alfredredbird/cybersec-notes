# Pretext
A basic intro and information on [[Tools#Reverse Engineering|Radare2]]

# Auto Analysis
We can have [[Tools#Reverse Engineering|Radare2]] analyze our binary. 
It's best to do [[Reverse Engineering#Quick External Probes|Quick Probes]] before using [[Tools#Reverse Engineering|Radare2]].
```bash
r2 -A ./wrecked
```
---
```bash
r2 -AAA ./wrecked
```
---
```Bash
r2 ./wrecked
```
 Every `-A` specifics the depth in which it should analyze with a max of `-AAA`.

# Common Analysis Commands 
These common commands can be ran from the inside of [[Tools#Reverse Engineering|Radare2]] after analysis.

| Command | Description                                    |
| ------- | ---------------------------------------------- |
| i       | `file info (format, arch, entry)`              |
| iS      | `section table`                                |
| ii      | `imports (imported symbols)`                   |
| iz      | `list strings`                                 |
| izz     | `count strings`                                |
| oo+     | `open file for writing (if you plan to patch)` |

# Analysis Workflow Commands
Analysis workflow commands to disassemble and analyze.

| Command    | Description                                    |
| ---------- | ---------------------------------------------- |
| aaa        | `full analysis, finds functions, xrefs, types` |
| aa         | `analyze functions+refs`                       |
| afl        | `list functions (addresses + sizes)`           |
| pdf @ main | `print disassembly of function @ main`         |
| pdr @ main | `print raw disassembly (linear)`               |
| pd 30      | `print next 30 instructions at current seek`   |
| s main     | `seek to symbol "main`                         |
| s entry0   | `seek to entry point`                          |

Examples:

```bash
r2 -A ./wrecked
# (inside r2)
[0x00001100]> s main
[0x000011e9]> pdf
            ; ICOD XREF from entry0 @ 0x1118(r)
┌ 538: int main (int argc, char **argv, char **envp);
│ afv: vars(11:sp[0x10..0xcb])
│           0x000011e9      f30f1efa       endbr64
│           0x000011ed      55             push rbp
│           0x000011ee      4889e5         mov rbp, rsp
│           0x000011f1      4881ecd000..   sub rsp, 0xd0
│           0x000011f8      64488b0425..   mov rax, qword fs:[0x28]
│           0x00001201      488945f8       mov qword [canary], rax
│           0x00001205      31c0           xor eax, eax
│           0x00001207      48b8c6cdcc..   movabs rax, 0xcdc6fad5d7cccdc6
│           0x00001211      48898565ff..   mov qword [var_9bh], rax
│           0x00001218      c7856cffff..   mov dword [var_94h], 0xd5d7cccd
│           0x00001222      c6853dffff..   mov byte [var_c3h], 0xa5
│           0x00001229      48c78550ff..   mov qword [var_b0h], 0xb
```
---

# Strings and Constants
[[Tools#Radare2|Radare2]] has built in commands to simplify the exploration of strings and constants.

| Command     | Description                       |
| ----------- | --------------------------------- |
| iz          | `show strings with address`       |
| iz-password | `search strings matching pattern` |
| izj         | `JSON output of strings`          |

---

# Viewing bytes / hex / ascii
There will come times when you need to dump some info into a format that is semi-readable.

| Command       | Description                       |
| ------------- | --------------------------------- |
| px 64         | `hex dump 64 bytes`               |
| px @ 0x400000 | `hex dump at address`             |
| pxr 128       | `hexdump + printable chars`       |
| p8 32         | `print 32 bytes as 8-bit numbers` |
Examples:
```Bash
[0x000011e9]> px 64
- offset -  E9EA EBEC EDEE EFF0 F1F2 F3F4 F5F6 F7F8  9ABCDEF012345678
0x000011e9  f30f 1efa 5548 89e5 4881 ecd0 0000 0064  ....UH..H......d
0x000011f9  488b 0425 2800 0000 4889 45f8 31c0 48b8  H..%(...H.E.1.H.
0x00001209  c6cd ccd7 d5fa c6cd 4889 8565 ffff ffc7  ........H..e....
0x00001219  856c ffff ffcd ccd7 d5c6 853d ffff ffa5  .l.........=....

[0x000011e9]> pxr 128
0x000011e9 0xe5894855fa1e0ff3   ....UH.. @ sym.main
0x000011f1 0x64000000d0ec8148   H......d
0x000011f9 0x0000002825048b48   H..%(... 172419746632
0x00001201 0xb848c031f8458948   H.E.1.H.
0x00001209 0xcdc6fad5d7cccdc6   ........
0x00001211 0xc7ffffff65858948   H..e....
0x00001219 0xd7cccdffffff6c85   .l......
0x00001221 0xa5ffffff3d85c6d5   ...=....
```

---

# Renaming, Comments, and Cross-references
Creating comments inside of [[Tools#Radare2|Radare2]].

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| afl                    | `list functions`                       |
| af (addr)              | `analyze/create function at addr`      |
| afvn (name) ?          | `(various var ops)`                    |
| afn sym_start 0x401000 | `rename function at addr to sym_start` |
| CC This_is_the_check   | `add comment at current address`       |
| CCu An_upper_comment   | `add comment visible in visual mode`   |
| Cd                     | `delete comment`                       |
| axt (addr)             | `list xrefs to an address`             |
| axf                    | `list xrefs from function`             |

---

# 7 — Graphical & visual navigation

```text
V        # visual (text) mode — press ? for help
VV       # visual graph mode (try VV to see graph; use arrows to navigate)
p        # in visual mode: 'p' cycle print modes (disasm/hex)
:`q` to quit visual mode
```

---

# 8 — Decompilation (r2dec plugin)

r2 has plugins — r2dec is the most popular decompiler plugin. Install if missing:

```bash
# install r2pm and r2dec (if not installed)
r2pm -i r2dec   # run as user with r2pm installed
```

Usage inside r2:

```text
pdd @ main    # decompile current function with r2dec (C-like output)
pdc          # decompile with default decompiler (if available)
pddj @ main  # decompile to JSON (if plugin supports)
```

> Note: r2dec output is best-effort. Always cross-check with `pdf` disassembly.

---

# 9 — Debugging with radare2

```bash
# launch under debugger
r2 -d ./wrecked
# inside r2 debug session:
db 0x400123   # set breakpoint at address
db sym.main    # set breakpoint at symbol (if symbol exists)
dc            # continue
ds            # step into
dso           # step over
dr            # print registers
dr rip=@rip   # show RIP
dps           # print stack
dpt           # print top of stack value
```

---

# 10 — Searching / signatures / patterns

```text
/?pattern        # search for asm pattern or bytes at current location
/ x <hexpattern> # search bytes across binary
/ cmd ~ mov      # search for mnemonic 'mov'
/ R type         # search for ROP gadgets? (use rabin2/capstone or ROPgadget externally)
```

---

# 11 — Patching (edit bytes) — **use with extreme caution**

```text
# write bytes (hex) at current address:
wx 9090 @ 0x401234   # write two NOPs at address

# assemble and write instruction(s):
wa jmp 0x401300      # assemble 'jmp 0x401300' and write it
```

To save patched file: you can write changes to a new file (verify with docs / your r2 version):

```text
# inside r2
w <newfile>   # write modified file (double-check this on your r2 build)
```

> Always keep an original backup. Patching is destructive.

---

# 12 — Exporting & scripting

```bash
# export analysis to JSON
r2 -qc 'aaa; agfj' ./wrecked > funcs.json   # graph JSON (agfj) after analysis

# use radare2 in scripts (r2pipe exists for Python/Node)
python3 -c "import r2pipe; r=r2pipe.open('wrecked'); print(r.cmd('afl'))"
```

---

# 13 — Useful external tools to pair with r2

- `rabin2` — metadata, symbols: `rabin2 -I wrecked`, `rabin2 -s wrecked`
    
- `objdump -d -M intel wrecked` — alternative disassembly
    
- `strings`, `hexdump`, `xxd`, `readelf`, `ldd`
    
- `gdb` or `gef/pwndbg` for heavy interactive debugging (can attach to same binary)
    

---

# 14 — Example quick checklist for initial reversing

1. `file wrecked` / `rabin2 -I wrecked` / `readelf -h wrecked`
    
2. `r2 -A ./wrecked`
    
3. `iS` / `ii` / `iz` — inspect sections, imports, strings
    
4. `afl` — list functions
    
5. `s main` → `pdf` / `pdd` — read main in disasm and decompiled C
    
6. set breakpoints & run under `r2 -d` if runtime behavior needed
    
7. search for suspicious strings or crypto keys with `iz~` and for syscalls with `pd`/`/ syscall`
    

---

# 15 — Handy one-liners

```bash
# open, jump to main and print decompiled C quickly:
r2 -qc 'aaa; s sym.main; pdd' ./wrecked

# list functions with sizes:
r2 -qc 'aaa; afl' ./wrecked

# dump strings containing "flag" or "password":
rabin2 -z wrecked | grep -i 'flag\|password'
# or inside r2:
r2 -qc 'aaa; iz~flag' ./wrecked
```

---

# 16 — Further learning / tips

- Learn `aaa`, `af*`, `pdf`, `pd`, `s`, `iz` — those cover 80% of day-to-day tasks.
    
- Use `V`/`VV` visual mode for graph exploration.
    
- Install `r2dec` (`r2pm -i r2dec`) to get readable C-like output (`pdd`).
    
- Combine radare2 + r2pipe (Python) to automate repetitive tasks.
    

---


