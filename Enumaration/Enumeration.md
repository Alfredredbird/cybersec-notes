# Pretext

Enumeration is the first initial steps to discover what is running on a target system.

# Port Scanning

Port scanning involves scanning an [[Termonology#IP|IP]] for open [[Termonology#Port|Ports]] to find vulnerabilities or what is running on it.
We can use a tool called [[Tools#Nmap|Nmap]] to scan for ports.
```Bash
nmap -sV -A -T5 -Pn -p- 192.168.x.x -vvv
```

| Argument | Description                                         |
| -------- | --------------------------------------------------- |
| `-sV`    | Grab service version.                               |
| `-A`     | Common scripts to run.                              |
| `-T5`    | The speed to scan with                              |
| `-Pn`    | Skips **ICMP** ping's. Can be unreliable sometimes. |
| `-p-`    | Scans all **65,535** ports.                         |
| `-sC`    | Can be a replacement for `-A`.                      |
| `-vvv`   | Sets the verbose status to very very very verbose.  |
Command output should be similar.
```Bash
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-23 11:36 PDT
Nmap scan report for windows-PC.lan (192.168.x.x)
Host is up (0.00013s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE         VERSION
111/tcp  open  rpcbind         2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|_  100000  3,4          111/udp6  rpcbind
902/tcp  open  ssl/vmware-auth VMware Authentication Daemon 1.10 (Uses VNC, SOAP)
5432/tcp open  postgresql      PostgreSQL DB 9.6.0 or later
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=alfredredbird-PC
| Subject Alternative Name: DNS:alfredredbird-PC
| Not valid before: 2025-06-21T07:57:41
|_Not valid after:  2035-06-19T07:57:41
```

# Directory Enumeration

Directory enumeration can be done in various ways.
The whole idea is to find and discover hidden files and directories on a website.
We can use [[Tools#gobuster|gobuster]], [[Tools#dirbuster|dirbuster]], or [[Tools#ffuf|ffuf]] to enumerate. 
All should have the same expected outputs.
With this command, we not only scan for directories, but we also make an attempt to find json,php,txt files.
```Bash
gobuster dir -u http://192.168.x.x -w /usr/share/wordlists/directorylist.txt -t 100 -x json,php,txt
```

| Mode  | Command Example                         | Description                |
| ----- | --------------------------------------- | -------------------------- |
| dir   | `gobuster dir -u URL -w WORDLIST`       | Directory/File brute-force |
| dns   | `gobuster dns -d DOMAIN -w WORDLIST`    | Subdomain enumeration      |
| vhost | `gobuster vhost -u URL -w WORDLIST`     | Virtual host discovery     |
| fuzz  | `gobuster fuzz -u URL/FUZZ -w WORDLIST` | Custom fuzzing             |

The [[Tools#dirbuster|dirbuster]] equivalent. 
```Bash
dirb http://192.168.x.x /usr/share/wordlists/directorylist.txt -t 100 -X .json,.php,.txt
```
The [[Tools#ffuf|ffuf]] equivalent.
```Bash
ffuf -u http://192.168.x.x/FUZZ -w /usr/share/wordlists/directorylist.txt \  
-t 100 -e .json,.php,.txt
```
All examples can enumerate sub folders too by replacing the url with the sub folder.
```Bash
http://192.168.x.x/subfolder/FUZZ
```
---
```Bash
http://192.168.x.x/subfolder/
```

# Subdomains

Subdomains are a child part of a domain. 
Example we can have `example.com` but a [[Termonology#subdomain|subdomain]] would be `admin.example.com`.
The domain will still be `example.com` but `admin.example.com` will be the [[Termonology#subdomain|subdomain]].
We can enumerate them via [[Tools#ffuf|ffuf]].
```Bash
ffuf -u http://FUZZ.example.com -w wordlist.txt -mc 200
```
`-mc 200` will only show [[Termonology#subdomain|subdomains]] that return a `200` status code. 

# WordPress Scanning

Enumerating WordPress can be great for finding plugin and users on a word press instance. 
The following command scans a target for basic details and makes an attempt to enumerate users.
```Bash
wpscan --url (target) -e u
```

# Exploit Searching

After doing a simple [[Tools#Nmap|Nmap]] scan it's best to do an exploit search. 
You can use [[Tools#Searchsploit|Searchsploit]] or the [exploit-db](https://www.exploit-db.com/).
```Bash
└─$ searchsploit vsftpd                
------------------------------------------------------
vsftpd 2.0.5 - 'CWD' (Authenticated) Remote Memory Consumption                   
vsftpd 2.0.5 - 'deny_file' Option Remote Denial of Service (1)   
vsftpd 2.0.5 - 'deny_file' Option Remote Denial of Service (2)  
vsftpd 2.3.2 - Denial of Service
vsftpd 2.3.4 - Backdoor Command Execution                              
vsftpd 2.3.4 - Backdoor Command Execution (Metasploit)                    
vsftpd 3.0.3 - Remote Denial of Service                                          
------------------------------------------------------
Shellcodes: No Results             
```

# NFS

Network File System share can be enumerated on a network easily. 
Misconfigured NFS shares often allow:
- Anonymous access
- Root squashing bypass
- Sensitive file disclosure
- Privilege escalation

---

We will first start with an [[Tools#Nmap|nmap]] scan to see what we can find.
```Bash
nmap -p 111,2049 --script=nfs* <target>
```
After the command is done running, we can continue with listing our shares with [[Linux Commands#showmount|showmount]].
```bash
showmount -e <target>
```
We can then enumerate all mount info.
```bash
showmount -a <target>
```
We can finally enumerate all mounted share info.
```bash
showmount -d <target>
```

---

Assuming everything went well, we can do a test mount without authentication.
```bash
mkdir /mnt/nfs
mount -t nfs <target>:/share /mnt/nfs
```
Sometimes the shares need to be mounted with `vers=3` or `vers-4`.
```bash
mount -t nfs -o vers=3 <target>:/share /mnt/nfs
```
---
```bash
mount -t nfs4 <target>:/share /mnt/nfs
```

---

If the above methods are not working, we can try to enumerate via RPC services.
```Bash
rpcinfo -p <target>
```
---
```Bash
rpcinfo -u <target> nfs
```

# SMB Shares

SMB shares are pretty similar to NFS when it comes to enumerating.
We can try to do a quick un-authenticated session to grab shares if it's allowed.
```Bash
smbclient -L //192.168.x.x -N
```
- `-L` = list shares
- `-N` = no password (null session)
---
If that does not work, we can enumerate with [[Code Commands#enum4linux|enum4linux]].
```Bash
enum4linux -a 192.168.x.x
```
It tries to pull:
- Users
- Shares
- Groups
- Policies
---
[[Linux Commands#smbmap|smbmap]] can also enumerate for share permissions.
```Bash
smbmap -H 192.168.x.x
```
It might show:
- Share permissions 
- Accessible paths

# Active Directory
