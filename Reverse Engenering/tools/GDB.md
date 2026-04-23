# Pretext

This note teaches the basics of reverse engineering a compiled program using GDB, focusing on understanding program flow, inspecting memory, and analyzing behavior. 

Before reversing, compile with debug symbols (if you have the source):
Example of compiling a `C` Program with the debug symbols.
```BBash
gcc -g program.c -o program
```
If you don’t have source code, just use the following command to check architecture, binary type, and if it’s stripped.

```bash
file program
```
Examples of output:
```Bash
program: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=96eaadbbc375b27b30cc52a1a7a801c5b2972ffd, for GNU/Linux 3.2.0, not stripped
```
 >Stripped binaries (`strip`) remove symbols. You’ll need more advanced techniques, like disassembly.

---

# Starting GDB

The simplest way to start to do the following.
```bash
gdb ./program
```
Inside GDB, common initial commands:

| Command        | Description                                    |
| -------------- | ---------------------------------------------- |
| file ./program | `load the binary (if not already done)`        |
| start          | `Start and break at main`                      |
| break main     | `Break at main function`                       |
| run            | `runs the program`                             |

# Inspecting Functions

Useful commands to explore functions:

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| info functions        | `List all functions`               |
| disassemble main      | `See assembly for main`            |
| disassemble func_name | `See assembly for other functions` |

> Try to look for interesting functions like password checks, license checks, etc.
    

---

# Breakpoints & Conditional Breakpoints

Stop execution at critical points.

| Command                                | Description                 |
| -------------------------------------- | --------------------------- |
| break main                             | `Set break point`           |
| break check_password                   | `Break at function`         |
| break *0x40123                         | `Break at specific address` |
| break check_password if strcmp_done==0 | `Conditional breakpoint`    |

> Conditional breakpoints allow stopping when variables meet criteria.
    
# Stepping Through Code

```gdb
step        # Step into functions (assembly + C)
next        # Step over functions
finish      # Run until current function returns
```

| Command | Description                          |
| ------- | ------------------------------------ |
| step    | `Step into functions (assembly + C)` |
| next    | `Step over functions`                |
| finish  | `Run until current function returns` |

# Inspecting Variables & Memory

Checking program data. 
Sometimes good things like passwords can hide inside.

| Command     | Description                                |
| ----------- | ------------------------------------------ |
| print var   | `Print C variable`                         |
| display var | `Automatically print when stopped`         |
| info locals | `List all local variables`                 |
| x/16x &var  | `Examine 16 words in hex at var's address` |

# Combining With Other Tools

You can combine [[Tools#GDB|GDB]] with other tools to help with reversing.
See [[Radare2#Useful External Tools|Useful tools]] for more info.
    
