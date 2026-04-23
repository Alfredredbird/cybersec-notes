

````markdown


GDB (GNU Debugger) is a powerful tool to debug programs written in C, C++, and other languages. This guide covers the basics and some advanced features.

---

## 1. Starting GDB

```bash
gdb ./program         # Start GDB with the executable
gdb ./program core    # Start GDB with a core dump
````

---

## 2. Basic Commands

|Command|Description|
|---|---|
|`run` or `r`|Start the program|
|`quit` or `q`|Exit GDB|
|`help`|Show help|
|`info`|Show program info (see subcommands below)|

### Info Subcommands

|Command|Description|
|---|---|
|`info breakpoints`|List breakpoints|
|`info registers`|Show CPU registers|
|`info locals`|Show local variables|
|`info args`|Show function arguments|

---

## 3. Breakpoints

Breakpoints allow you to stop the program at specific locations.

```bash
break main              # Break at function main
break 25                # Break at line 25
break file.c:50         # Break at line 50 in file.c
break myfunc if x>5     # Conditional breakpoint
```

|Command|Description|
|---|---|
|`delete`|Delete a breakpoint|
|`disable`|Disable a breakpoint|
|`enable`|Enable a breakpoint|

---

## 4. Running & Controlling Execution

|Command|Description|
|---|---|
|`run` or `r`|Start program execution|
|`continue` or `c`|Resume execution until next breakpoint|
|`step` or `s`|Step into function calls|
|`next` or `n`|Step over function calls|
|`finish`|Run until the current function returns|
|`until`|Continue until a specific line|

---

## 5. Examining Variables & Memory

|Command|Description|
|---|---|
|`print var` or `p var`|Print the value of `var`|
|`display var`|Print variable every time program stops|
|`undisplay`|Stop displaying variable|
|`x/nfu address`|Examine memory: n = count, f = format (x/d/o/c/s), u = unit size|
|`set var=val`|Change the value of a variable|

### Memory Formats

- `x/d` – decimal
    
- `x/x` – hexadecimal
    
- `x/o` – octal
    
- `x/c` – character
    
- `x/s` – string
    

---

## 6. Call Stack & Backtrace

|Command|Description|
|---|---|
|`backtrace` or `bt`|Show call stack|
|`frame n`|Switch to frame `n`|
|`up` / `down`|Move up/down the call stack|
|`info frame`|Detailed info about the current frame|

---

## 7. Watching Variables

Watch variables to stop execution when they change:

```bash
watch var               # Stop when var changes
rwatch var              # Stop when var is read
awatch var              # Stop when var is read or written
```

---

## 8. Signals & Exceptions

|Command|Description|
|---|---|
|`handle SIGSEGV stop`|Stop on segmentation fault|
|`handle SIGINT ignore`|Ignore interrupt signal|
|`signal SIGINT`|Send signal to the program|

---

## 9. Advanced Features

### Disassembly

```bash
disassemble             # Disassemble current function
disassemble main        # Disassemble main function
```

### Core Dumps

```bash
gdb ./program core      # Analyze a core dump
```

### Remote Debugging

```bash
target remote localhost:1234   # Connect to remote GDB server
```

---

## 10. Tips & Tricks

- Use `layout src` for TUI mode (source view)
    
- Use `layout asm` for assembly view
    
- Use `layout split` for both source and assembly
    
- `set pagination off` prevents `--More--` prompts
    
- `set print pretty on` makes structs easier to read
    

---

## References

- [GDB Official Manual](https://sourceware.org/gdb/current/onlinedocs/gdb/)
    
- [GDB Tutorial by GNU](https://www.gnu.org/software/gdb/documentation/)
    
- [GDB Cheat Sheet PDF](https://darkdust.net/files/GDB%20Cheat%20Sheet.pdf)
    

---

**Pro Tip:** Practice by compiling a small C program with `-g` flag to include debug symbols:

```bash
gcc -g program.c -o program
gdb ./program
```

