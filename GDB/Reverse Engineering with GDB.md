
````markdown

This guide teaches the basics of reverse engineering a compiled program using GDB, focusing on understanding program flow, inspecting memory, and analyzing behavior.

---

## 1. Preparing the Program

Before reversing, compile with debug symbols (if you have the source):

```bash
gcc -g program.c -o program   # Includes debug symbols
````

If you don’t have source code, just use:

```bash
file program
```

To check architecture, binary type, and if it’s stripped.

**Tip:** Stripped binaries (`strip`) remove symbols; you’ll need more advanced techniques, like disassembly.

---

## 2. Starting GDB

```bash
gdb ./program
```

Inside GDB, common initial commands:

```gdb
file ./program           # Load binary
start                    # Start and break at main
break main               # Break at main function
run                      # Execute program
```

---

## 3. Inspecting Functions

Use these commands to explore functions:

```gdb
info functions           # List all functions
disassemble main         # See assembly for main
disassemble func_name    # See assembly for other functions
```

- Look for **interesting functions**, e.g., password checks, license checks, or key calculations.
    

---

## 4. Breakpoints & Conditional Breakpoints

Stop execution at critical points:

```gdb
break main
break check_password     # Break at function
break *0x401234          # Break at specific address
break check_password if strcmp_done==0   # Conditional breakpoint
```

- Conditional breakpoints allow stopping when variables meet criteria.
    

---

## 5. Stepping Through Code

```gdb
step        # Step into functions (assembly + C)
next        # Step over functions
finish      # Run until current function returns
```

- Observe how variables change during execution.
    
- Useful for understanding loops, calculations, or checks.
    

---

## 6. Inspecting Variables & Memory

Check program data:

```gdb
print var          # Print C variable
display var        # Automatically print when stopped
info locals        # List all local variables
x/16x &var         # Examine 16 words in hex at var's address
```

- Look for **password buffers, flags, or magic numbers**.
    

---

## 7. Patching Programs (Optional / Advanced)

Sometimes you want to bypass a check:

```gdb
set var = 1         # Change a variable
jump *0x401234       # Jump to address, skipping code
```

**Warning:** Only for learning. Never use this on software without permission.

---

## 8. Tracing Execution

GDB can log execution:

```gdb
record              # Start recording execution
replay              # Replay recorded execution
```

- Useful for **tracking program behavior without altering it**.
    

---

## 9. Inspecting Strings

To find human-readable text (like hints, passwords, or error messages):

```gdb
strings ./program   # Outside GDB, list all strings
find &buffer, +100, "secret"  # Search memory for string
```

---

## 10. Combining With Other Tools

- **objdump**: `objdump -d program` → disassemble without running
    
- **readelf**: `readelf -s program` → list symbols
    
- **radare2 / Cutter**: advanced static analysis
    
- **IDA Free**: static reverse engineering GUI
    

---

## 11. Example Workflow

1. `file program`
    
2. `break main`
    
3. `run`
    
4. `next` through initialization
    
5. `info functions` → find `check_flag`
    
6. `break check_flag`
    
7. `run` and input test data
    
8. `step` and `print` variables
    
9. Identify the correct flag from memory/registers
    
10. Optionally patch with `set` if learning bypasses
    

---

## 12. Tips

- Learn **assembly basics** (x86/x86_64).
    
- Use **TUI mode**: `layout asm`, `layout split`, `layout src`.
    
- Keep **notes of addresses and offsets**.
    
- Practice on simple CTF challenges or crackmes first.
    

---

## References

- [GDB Official Manual](https://sourceware.org/gdb/current/onlinedocs/gdb/)
    
- [Practical Reverse Engineering Book](https://www.amazon.com/Practical-Reverse-Engineering-Reversing-Obfuscation/dp/1118787315)
    
- [Reverse Engineering 101 Tutorials](https://reverseengineering.stackexchange.com/)
    
- [Crackmes.one](https://crackmes.one/) – Safe practice binaries
    
