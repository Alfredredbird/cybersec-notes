# Reverse Engineering Learning Roadmap

Reverse engineering is the skill of understanding how a program works from its binary, without source code. This roadmap will guide you from beginner to advanced skills, tools, and exercises.

---

## 🟢 Quick Overview

**Skills to Learn:**
- Low-level programming (C, pointers)
- CPU architecture & assembly (x86/x64, ARM basics)
- OS internals (processes, syscalls, dynamic linking)
- Static analysis (disassembly, decompilation)
- Dynamic analysis (debugging, runtime tracing)
- Tooling & automation (Ghidra/IDA/radare2, GDB/x64dbg, Python)

---

## 📅 12-Week Practical Roadmap

### Week 1 — Foundations
- Learn C (pointers, stack, heap, buffer overflow basics)
- Install toolchain: gcc, gdb, pwndbg, x64dbg, Ghidra, radare2

### Week 2 — Assembly Basics
- Learn x86-64 assembly: registers, call/ret, stack frames, calling conventions
- Exercise: compile a tiny C function and disassemble with `objdump -d`

### Week 3 — Static Analysis
- Use Ghidra/IDA/radare2 to explore binaries
- Exercise: open `ls` or a simple ELF and locate `main` and used libraries

### Week 4 — Dynamic Analysis & Debugging
- Learn GDB/x64dbg (breakpoints, stepping, watchpoints)
- Exercise: step through a program and observe branch decisions

### Week 5 — Common Patterns
- Recognize password checks, strcmp, checksum loops, format strings
- Exercise: reverse a simple “crackme” binary

### Week 6 — Win vs *nix Binaries
- Understand PE vs ELF, DLLs vs .so, import tables, sections
- Exercise: inspect imports with `readelf -a` (ELF) or `dumpbin /headers` (PE)

### Week 7 — Obfuscation & Packers
- Understand UPX, simple obfuscation, anti-debug tricks
- Exercise: pack a binary with UPX and practice unpacking

### Week 8 — Advanced Debugging
- Learn dynamic instrumentation: `ptrace`, `strace`, `ltrace`, Frida, DynamoRIO
- Exercise: trace syscalls of a program using `strace`

### Week 9 — Reverse Engineering for Exploitation
- Learn buffer overflow, ROP basics, ASLR, DEP/NX, stack canaries
- Exercise: small controlled buffer overflow exploit

### Week 10 — Automation & Scripting
- Learn Python for parsing disassembly (`pwntools`, `angr`, `capstone`)
- Exercise: write a script to extract & decode strings from a binary

### Week 11 — Real-World Practice
- Solve CTF reversing challenges
- Exercise: complete 3 beginner→intermediate reversing CTF challenges

### Week 12 — Project & Specialization
- Build a capstone: fully reverse a small closed-source utility or write a deobfuscator
- Decide specialization: malware, firmware/embedded, game-hacking, vulnerability research

---

## 🛠 Recommended Tools
- **Ghidra** (free decompiler)
- **GDB + pwndbg** (Linux debugging)
- **x64dbg** (Windows GUI debugger)
- **radare2 / Cutter** (free alternative)
- Optional: Binary Ninja / IDA Pro
- Python + `pwntools`, `capstone`, `keystone`

---

## 📝 Beginner Exercise

1. Create a small C program:

```c
#include <stdio.h>
#include <string.h>
int main(){
    char buf[64];
    printf("password: ");
    scanf("%63s", buf);
    if(strcmp(buf,"hunter2")==0){
        printf("welcome\n");
    } else printf("nope\n");
}
