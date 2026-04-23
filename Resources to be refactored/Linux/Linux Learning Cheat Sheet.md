# Linux Learning Cheat Sheet

This cheat sheet covers essential Linux commands, file system navigation, permissions, process management, networking, and package management.

---

## **1. File System Navigation**

| Command       | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `pwd`         | Print working directory                                              |
| `ls`          | List files (use `ls -l` for details, `ls -a` for hidden files)       |
| `cd <dir>`    | Change directory                                                     |
| `mkdir <dir>` | Create directory                                                     |
| `rmdir <dir>` | Remove empty directory                                               |
| `rm -r <dir>` | Remove directory and contents                                        |
| `tree`        | View directory tree structure (install with `sudo apt install tree`) |

---

## **2. File Operations**

| Command | Description |
|---------|------------|
| `touch <file>` | Create empty file |
| `cp <source> <dest>` | Copy file or directory (`-r` for recursive) |
| `mv <source> <dest>` | Move or rename file/directory |
| `rm <file>` | Remove file |
| `cat <file>` | Display file content |
| `less <file>` | View file with pagination |
| `head <file>` | View first 10 lines |
| `tail <file>` | View last 10 lines (`-f` to follow) |
| `find <dir> -name <pattern>` | Search for files |

---

## **3. File Permissions**

| Command | Description |
|---------|------------|
| `ls -l` | Show file permissions |
| `chmod 755 <file>` | Change permissions (rwxr-xr-x) |
| `chown user:group <file>` | Change owner and group |
| `umask` | Default permission mask |

**Permission Notation:**

- `r` = read, `w` = write, `x` = execute  
- Numeric: `r=4`, `w=2`, `x=1` → sum for each user/group/other

---

## **4. Process Management**

| Command | Description |
|---------|------------|
| `ps aux` | Show running processes |
| `top` / `htop` | Interactive process monitor (`sudo apt install htop`) |
| `kill <PID>` | Kill process by PID |
| `killall <name>` | Kill all processes with name |
| `bg` / `fg` | Background / foreground jobs |
| `jobs` | List background jobs |

---

## **5. Disk and System Info**

| Command | Description |
|---------|------------|
| `df -h` | Disk usage of filesystems |
| `du -h <dir>` | Disk usage of directory |
| `free -h` | Memory usage |
| `uname -a` | System info |
| `uptime` | System uptime |

---

## **6. Networking**

| Command | Description |
|---------|------------|
| `ifconfig` / `ip addr` | Network interface info |
| `ping <host>` | Test connectivity |
| `netstat -tulnp` | Open ports and connections |
| `curl <url>` | Fetch web content |
| `wget <url>` | Download files from web |
| `ssh user@host` | Connect to remote host |
| `scp file user@host:/path` | Copy files to remote host |

---

## **7. Package Management (Debian/Ubuntu)**

| Command | Description |
|---------|------------|
| `sudo apt update` | Update package list |
| `sudo apt upgrade` | Upgrade installed packages |
| `sudo apt install <package>` | Install package |
| `sudo apt remove <package>` | Remove package |
| `dpkg -l` | List installed packages |

**RedHat/CentOS equivalents:**

- `yum install <package>` or `dnf install <package>`  
- `yum update` or `dnf update`

---

## **8. Users and Groups**

| Command | Description |
|---------|------------|
| `whoami` | Current user |
| `id` | User ID and groups |
| `adduser <user>` | Add new user |
| `passwd <user>` | Change password |
| `groups <user>` | List groups |
| `usermod -aG <group> <user>` | Add user to group |

---

## **9. Searching & Text Processing**

| Command | Description |
|---------|------------|
| `grep 'text' <file>` | Search for text in file |
| `grep -r 'text' <dir>` | Recursive search |
| `awk '{print $1}' <file>` | Text processing / column extraction |
| `sed 's/old/new/g' <file>` | Stream editor (replace text) |
| `cut -d ' ' -f 1 <file>` | Extract columns from file |

---

## **10. Shell Tips**

- `history` → View command history  
- `!!` → Repeat last command  
- `!n` → Repeat command number `n` from history  
- `tab` → Autocomplete file/directory names  
- `Ctrl + R` → Reverse search in history  
- `man <command>` → View manual  

---

## **11. Learning Resources**

- [Linux Journey](https://linuxjourney.com/)  
- [OverTheWire: Bandit](https://overthewire.org/wargames/bandit/) (hands-on practice)  
- [The Linux Command Line Book](http://linuxcommand.org/tlcl.php)  
- [tldr pages](https://tldr.sh/) (simplified command help)  
