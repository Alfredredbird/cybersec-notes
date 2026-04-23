# Radare2 CLI cheat-sheet (ELF x86_64)


> Basic start (auto-analyze):

```bash
# open and run auto-analysis (slow but thorough)
r2 -A ./wrecked

# or open without analysis so you can run commands manually:
r2 ./wrecked
```

---

# 1 — Quick external probes (before r2)

```bash
# quick binary metadata
file wrecked
rabin2 -I wrecked     # high-level info (arch, bits, libs, entry)
readelf -h wrecked    # ELF header
readelf -s wrecked    # symbol table
ldd ./wrecked          # dynamic libs (if runnable on your system)
strings wrecked | less  # obvious strings
```

---

# 2 — Start & common analysis commands (inside r2)

```text
# open an analyzed session fast:
r2 -A ./wrecked

# inside r2 -> recommended first commands:
i        # file info (format, arch, entry)
iS       # section table
ii       # imports (imported symbols)
iz       # list strings
izz      # count strings
oo+      # open file for writing (if you plan to patch)
```

---

# 3 — Analysis workflow

```text
aaa      # full analysis (analysis all) — finds functions, xrefs, types
aa       # analyze functions+refs
afl      # list functions (addresses + sizes)
pdf @ main    # print disassembly of function @ main (graph-like output)
pdr @ main    # print raw disassembly (linear)
pd 30        # print next 30 instructions at current seek
s main       # seek to symbol "main"
s entry0     # seek to entry point
```

Examples:

```bash
# open and immediately jump to main and decompile
r2 -A ./wrecked
# (inside r2)
s main
pdf
```

---

# 4 — Strings & constants

```text
iz          # show strings with address
iz~password # search strings matching pattern
izj         # JSON output of strings (useful for scripting)
```

---

# 5 — Viewing bytes / hex / ascii

```text
px 64       # hex dump 64 bytes
px @ 0x400000   # hex dump at address
pxr 128     # hexdump + printable chars
p8 32       # print 32 bytes as 8-bit numbers
```

---

# 6 — Renaming, comments, and cross-references

```text
afl              # list functions
af <addr>        # analyze/create function at addr
afvn <name> ?    # (various var ops) — prefer simple:
afn sym_start 0x401000   # rename function at addr to sym_start
CC This_is_the_check   # add comment at current address
CCu An_upper_comment   # add comment visible in visual mode
Cd               # delete comment
axt <addr>       # list xrefs to an address
axf              # list xrefs from function
```

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


