# Pretext

[[Linux Commands#ls|ls]] is a command that almost everyone learns first. 
[[Linux Commands#ls|ls]] lists folders, files, and can list hidden directories on a machine.

# Basic Usage

To use [[Linux Commands#ls|ls]], it's quite simple. 
Open a terminal and type [[Linux Commands#ls|ls]].
Now the expected output might be different for each person, but we can see what is inside of my `tools` folder.
```Bash
alfredredbird@windows-PC:~/tools 7 files ⏱ 2.8s 
$ ls
CiLocks   evillimiter   john   recaf-launcher-gui-0.8.8.jar  roblox-checker   tookie-osint   venv
```
To see hidden folders, we can use the `-a` option to display everything.
```Bash
alfredredbird@windows-PC:~/vmware 1 files ⏱ 5.3s 
$ ls -a
 .   ..   .imhidden
```
We can see that the hidden folder `.imhidden` was displayed.
Now if we pair `-a` with `-l`, we can see all the hidden items and what permissions they have.
```Bash
$ ls -la
drwxrwxr-x alfredredbird alfredredbird 4.0 KB Sun May  3 14:26:28 2026 .
drwxr-x--- alfredredbird alfredredbird 4.0 KB Sun May  3 14:23:37 2026 ..
.rw-rw-r-- alfredredbird alfredredbird   0 B  Sun May  3 14:26:28 2026 .imhidden
```
We can also list the contents of a directory if we supply the path. 
We can combine our arguments with the path as well.
```Bash
alfredredbird@windows-PC:~ 117 files ⏱ 34.7s 
$ ls /tmp
 qtsingleapp-Pentab-9c9b                                                          vmware-root
 qtsingleapp-Pentab-9c9b-lockfile                                                 scoped_dirFd4AaP                     
```
---
