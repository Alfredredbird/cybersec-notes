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

>Examples:

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

# Strings and Constants

[[Tools#Radare2|Radare2]] has built in commands to simplify the exploration of strings and constants.

| Command     | Description                       |
| ----------- | --------------------------------- |
| iz          | `show strings with address`       |
| iz-password | `search strings matching pattern` |
| izj         | `JSON output of strings`          |

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

# Graphical and Visual Navigation

While [[Tools#Radare2|Radare2]] is a command line based tool, it does have some sort of UI and visual navigation.

```text
V        # visual (text) mode — press ? for help
VV       # visual graph mode (try VV to see graph; use arrows to navigate)
p        # in visual mode: 'p' cycle print modes (disasm/hex)
:`q` to quit visual mode
```

| Command | Description                      |
| ------- | -------------------------------- |
| V       | `visual (text) mode`             |
| VV      | `visual graph mode`              |
| p       | `cycle print modes (disasm/hex)` |
| q       | `to quit`                        |

# Decompilation 

[[Tools#Radare2|Radare2]] has plugins that can be installed. 
r2dec is one of the most popular decompiler plugins. 
Install if missing:

```bash
r2pm -i r2dec
```
You can also use the ghidra decompiler too.
```bash
r2pm -i r2ghidra-dec
```
Usage inside r2:

```text
pdd @ main    # decompile current function with r2dec (C-like output)
pdc          # decompile with default decompiler (if available)
pddj @ main  # decompile to JSON (if plugin supports)
```

| Command     | Description                            |
| ----------- | -------------------------------------- |
| pdd @ main  | `decompile current function with r2de` |
| pdc         | `decompile with default decompiler`    |
| pddj @ main | `decompile to JSON`                    |

> Note: r2dec output is best effort. Always cross-check with [[Radare2#Analysis Workflow Commands|pdf]] disassembly.

# Debugging With Radare2

Common debugging commands for patching and learning.

| Command     | Description                                   |
| ----------- | --------------------------------------------- |
| db 0x400123 | `set breakpoint at address`                   |
| db sym.main | `set breakpoint at symbol (if symbol exists)` |
| dc          | `continue`                                    |
| ds          | `step into`                                   |
| dso         | `step over`                                   |
| dr          | `print registers`                             |
| dr rip=@rip | `show RIP`                                    |
| dps         | `print stack`                                 |
| dpt         | `print top of stack value`                    |

# Exporting and Scripting

There are many ways you can script with [[Tools#Radare2|Radare2]] however these are simple examples.
```bash
r2 -qc 'aaa; agfj' ./wrecked > funcs.json

# use radare2 in scripts
python3 -c "import r2pipe; r=r2pipe.open('wrecked'); print(r.cmd('afl'))"
```

# Useful External Tools

Useful tools that are useful for working with [[Tools#Radare2|Radare2]].

| Command                                       | Description               |
| --------------------------------------------- | ------------------------- |
| `rabin2`                                      | `metadata, symbol`        |
| `objdump`                                     | `alternative disassembly` |
| `strings`, `hexdump`, `xxd`, `readelf`, `ldd` | `usefull for strings`     |
| `gdb`                                         | `interactive debugging`   |

# Handy One-liners

Super handy one-liners that are quite useful.
```bash
# open, jump to main and print decompiled quickly:
r2 -qc 'aaa; s sym.main; pdd' ./wrecked

# list functions with sizes:
r2 -qc 'aaa; afl' ./wrecked

# dump strings containing "flag" or "password":
rabin2 -z wrecked | grep -i 'flag\|password'
# or inside r2:
r2 -qc 'aaa; iz~flag' ./wrecked
```