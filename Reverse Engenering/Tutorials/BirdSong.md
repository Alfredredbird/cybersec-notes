# Pretext

BirdSong is a simple `x86-64` `C` program that I wrote and compiled for [CrackMyApp](https://crackmy.app/crackmes/bird-song-0147). 
In this tutorial, we will use [[Radare2]] to decomplie our binary and reverse engineer it.
MD5 of the binary `beed2b4fc8ed192867cb04a47b960a85`.
Zip password `crackmes.one`.
# Info Gathering

One supper important thing that we should do before we start reversing, is to gather some info about the binary that we are going to try to reverse.
We will first look for the file architecture and any `strings` inside of the program.
After running the following commands, it doesn't seem like we find any good `strings`, but we see it is an `x86-64` file.
```Bash
alfredredbird@windows-PC:~/reveng 5 files 
$ file birdsong
birdsong: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=96eaadbbc375b27b30cc52a1a7a801c5b2972ffd, for GNU/Linux 3.2.0, not stripped

alfredredbird@windows-PC:~/reveng 5 files ⏱ 2.1s 
$ strings birdsong
/lib64/ld-linux-x86-64.so.2
mgUa
fgets
stdin
puts
__stack_chk_fail
putchar
strcspn
__libc_start_main
__cxa_finalize
...
...
```

# Reversing

Now on to reversing! Let's first run the binary and see what it is asking for. 
We will set the file execution permissions with the following.
```Bash
$ chmod + birdsong
```
After running the file, it asks us for a password as we can see below.
```Bash
alfredredbird@windows-PC:~/reveng 5 files ⏱ 59.6s 
$ ./birdsong 
Enter password: 
```
Now let's run [[Radare2]] with the arguments `-AAA` for maximum analysis.
```Bash
$ r2 -AAA birdsong
```
We should be greeted with something similar to this.
```Bash
INFO: Finding function preludes (aap)
INFO: Enable anal.types.constraint for experimental type propagation
INFO: Reanalizing graph references to adjust functions count (aarr)
INFO: Autoname all functions (.afna@@c:afla)
[0x00001100]> 
```
The `[0x00001100]>` is our byte address that we are in. 
Let's run `afl` for all functions list to see what functions we have.
```Bash
[0x00001100]> afl
0x000010a0    1     10 sym.imp.putchar
0x000010b0    1     10 sym.imp.puts
0x000010c0    1     10 sym.imp.__stack_chk_fail
0x000010d0    1     10 sym.imp.printf
0x000010e0    1     10 sym.imp.strcspn
0x000010f0    1     10 sym.imp.fgets
0x00001100    1     37 sub.entry0_1100
0x00001130    4     34 sub.deregister_tm_clones_1130
0x00001160    4     51 sub.register_tm_clones_1160
0x000011a0    5     54 sub.entry.fini0_11a0
0x00001090    1     10 sub.plt.got_1090
0x000011e0    1      9 sub.entry.init0_11e0
0x00001404    1     13 sub._fini_1404
0x000011e9   18    538 sub.main_11e9
0x00001000    3     27 sub._init_1000
0x00001030    2     26 sub.plt_1030
0x00001040    1     14 sub.plt_1040
0x00001050    1     14 sub.plt_1050
0x00001060    1     14 sub.plt_1060
0x00001070    1     14 sub.plt_1070
0x00001080    1     14 sub.plt_1080
[0x00001100]> 
```
Now after running `afl`, we get a large amount of functions that we could use. 
For now, I would like to use `sub.main_11e9` with the byte address of `0x000011e9`.
Let's run a function saver with `s main ` to save our function.
Then let's type `pdf` to print out our function.
```Bash
[0x00001100]> s main
[0x000011e9]> pdf
            ;-- main:
            ; ICOD XREF from sub.entry0_1100 @ 0x1118(r)
┌ 538: sub.main_11e9 ();
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
│           0x00001234      488d05c90d..   lea rax, str.Enter_password: ; 0x2004 ; "Enter password: "
│           0x0000123b      4889c7         mov rdi, rax                ; const char *format
│           0x0000123e      b800000000     mov eax, 0
│           0x00001243      e888feffff     call sym.imp.printf         ; int printf(const char *format)
│           0x00001248      488b15c12d..   mov rdx, qword [obj.stdin]  ; obj.__TMC_END__
│                                                                      ; [0x4010:8]=0 ; FILE *stream
│           0x0000124f      488d8570ff..   lea rax, [s1]
│           0x00001256      be80000000     mov esi, 0x80               ; int size
│           0x0000125b      4889c7         mov rdi, rax                ; char *s
│           0x0000125e      e88dfeffff     call sym.imp.fgets          ; char *fgets(char *s, int size, FILE *stream)
│           0x00001263      4885c0         test rax, rax
```
If you haven't, installed the ghidra extension see [[Radare2#Decompilation|here]].
If you have, let's run `pdg` to have ghidra decompile our binary.
Now that we have the code in somewhat of a readable format, let's work through it now.
What is important to us this the following code loop. 
It is what checks for the correct password.
```Bash
for (uStack_c0 = 0; uStack_c0 < 0xb; uStack_c0++) {  
  if ((auStack_a3[uStack_c0] ^ 0xa5) != auStack_a3[uStack_c0 + 0xb]) {  
    puts("Incorrect — quitting.");  
    return 1;  
}  
}
```
Another thing that we can notice is the password is hard coded in an XOR table.
```Bash
auStack_a3[0] = 0xc6;
auStack_a3[1] = 0xcd;
auStack_a3[2] = 0xcc;
auStack_a3[3] = 0xd7;
auStack_a3[4] = 0xd5;
auStack_a3[5] = 0xfa;
auStack_a3[6] = 0xc6;
auStack_a3[7] = 0xcd;
auStack_a3[8] = 0xcc;
auStack_a3[9] = 0xd7;
auStack_a3[10] = 0xd5;
```
We can see the table goes as follows.

| Index | Byte | XOR 0xA5 | Result      |
|------:|:-----|:---------|:------------|
| 0     | C6   | ^ A5     | 63 ('c')    |
| 1     | CD   | ^ A5     | 68 ('h')    |
| 2     | CC   | ^ A5     | 69 ('i')    |
| 3     | D7   | ^ A5     | 72 ('r')    |
| 4     | D5   | ^ A5     | 70 ('p')    |
| 5     | FA   | ^ A5     | 5F ('_')    |
| 6     | C6   | ^ A5     | 63 ('c')    |
| 7     | CD   | ^ A5     | 68 ('h')    |
| 8     | CC   | ^ A5     | 69 ('i')    |
| 9     | D7   | ^ A5     | 72 ('r')    |
| 10    | D5   | ^ A5     | 70 ('p')    |
Now reading the table from index `0` to index `10`, we get the password `chirp_chirp`.
Let's try to give it to our binary.
```Bash
$ ./birdsong 
Enter password: chirp_chirp
63 68 69 72 70 5f 63 68 69 72 70
Correct! Well done.
```