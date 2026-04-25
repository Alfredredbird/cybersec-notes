# Pretext

[[Termonology#FTP|FTP]] or File Transfer Protocol is a simple service that allows us to run a file sharing service on our [[Termonology#IP|IP]]. [[Termonology#FTP|FTP]] can be logged into via the terminal and you can navigate the directories in a Unix style. [[Termonology#FTP|FTP]] usually is hosted on [[Termonology#Port|port]] `21`.

# Detecting 

The very first step to using [[Termonology#FTP| FTP]] is to do a bit of [[Enumeration]] to see if it's running. 
See [[Tools#Nmap|nmap]] to learn more about scanning [[Termonology#IP|IP's]] for protocols.
This command gets the service version of our FTP instance.
```Bash
nmap -sV -p 21 192.168.x.x
```
# Logging in 

Connecting to our [[Termonology#FTP|FTP]] server, it asks us for our username and a password. 
For my instance, I am logging in with the username `frank` as I know it exists on my server.
In some cases, you can login with the credentials `anonymous:anonymous` to gain anonymous access to the server.
```Bash
$ ftp 10.145.151.48
Connected to 10.145.151.48.
220 (vsFTPd 3.0.5)
Name (10.145.151.48:kali): frank
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> 
```

# Inspecting Directory

Since our [[Termonology#FTP|FTP]] server uses a `UNIX` type to work, we can run `ls` to see our files.
```Bash
ftp> ls
229 Entering Extended Passive Mode (|||45623|)
150 Here comes the directory listing.
drwx------   10 1001     1001         4096 Sep 15  2021 Maildir
-rw-rw-r--    1 1001     1001         4006 Sep 15  2021 README.txt
-rw-rw-r--    1 1001     1001           39 Sep 15  2021 ftp_flag.thm
226 Directory send OK.
ftp> 
```

# Taking Files

Taking files is quite simple if we have permission to grab them
```Bash
ftp> get ftp_flag.thm
local: ftp_flag.thm remote: ftp_flag.thm
229 Entering Extended Passive Mode (|||59698|)
150 Opening BINARY mode data connection for ftp_flag.thm (39 bytes).
100% |******************************************************************************************|    39       11.77 KiB/s    00:00 ETA
226 Transfer complete.
39 bytes received in 00:00 (0.43 KiB/s)
ftp> 
```

# Sending Files

```Bash
ftp> put
(local-file) /home/kali/Desktop/hash
(remote-file) hash
local: /home/kali/Desktop/hash remote: hash
229 Entering Extended Passive Mode (|||35314|)
550 Permission denied.
ftp> 
```

# Deleting Files

```Bash
ftp> delete ftp_flag.thm
550 Permission denied.
ftp> 
```