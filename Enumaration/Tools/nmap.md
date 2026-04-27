# Pretext

 [[Tools#Nmap|Nmap]] or `network map` is a tool for scanning wifi networks for open [[Termonology#Port|Ports]] on available [[Termonology#IP|IP's]]on a network. [[Tools#Nmap|nmap]] can also provide service versions and other important details. You will see below how confusing [[Tools#Nmap|nmap's]] formatting and display of data can be.
# Basic Scan

Scanning with [[Tools#Nmap|nmap]] is quite simple. The scan format should go as followed.
```Bash
$ nmap 192.168.12.187
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-27 00:41 PDT
Nmap scan report for windows-PC.lan (192.168.12.187)
Host is up (0.00012s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE
111/tcp  open  rpcbind
902/tcp  open  iss-realsecure
5432/tcp open  postgresql

Nmap done: 1 IP address (1 host up) scanned in 0.04 seconds
```
After this scan finished, we can see that my machine is running `rpcbind`, `iss-realsecure`, and `postgresql`. 
Now this scan is good for quick testing, but it should not be used as a final result.
We can go more in detail with our by scanning all `65,536` [[Termonology#Port|Ports]] on our [[Termonology#IP|IP]] by using the `-p-` argument. 
I would recommend that we also tack on the `-T5` argument for it to scan the fastest.
```Bash
$ nmap 192.168.12.187 -p- -T5
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-27 00:45 PDT
Nmap scan report for windows-PC.lan (192.168.12.187)
Host is up (0.00011s latency).
Not shown: 65529 closed tcp ports (conn-refused)
PORT      STATE SERVICE
111/tcp   open  rpcbind
902/tcp   open  iss-realsecure
5432/tcp  open  postgresql
27036/tcp open  unknown
42765/tcp open  unknown
57621/tcp open  unknown

Nmap done: 1 IP address (1 host up) scanned in 2.24 seconds
```
Now that the scan is done, we get three new `unknown` [[Termonology#Port|Ports]].
Lets go further into scanning these new unknown  [[Termonology#Port|Ports]].
# Service Version Scan

Now that we know what  [[Termonology#Port|Ports]] are running on our machine, lets use the `-p (ports)` argument with each  [[Termonology#Port|Ports]] separated by a comma so we don't have to scan all the  [[Termonology#Port|Ports]] to save time.
We will also use the `-sV` for the `service version` scan.
```Bash
$ nmap 192.168.12.187 -p 111,902,5432,27036,42765,57621 -sV -T5
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-27 00:50 PDT
Nmap scan report for windows-PC.lan (192.168.12.187)
Host is up (0.000076s latency).

PORT      STATE SERVICE         VERSION
111/tcp   open  rpcbind         2-4 (RPC #100000)
902/tcp   open  ssl/vmware-auth VMware Authentication Daemon 1.10 (Uses VNC, SOAP)
5432/tcp  open  postgresql      PostgreSQL DB 9.6.0 or later
27036/tcp open  ssl/steam       Valve Steam In-Home Streaming service (TLSv1.2 PSK)
42765/tcp open  unknown
57621/tcp open  unknown

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 33.66 seconds
```
Now that after our scan has finished, we can see we now have more details about what is running. We can see that [[Tools#Nmap|nmap]] thinks that our database is`PostgreSQL DB 9.6.0 or later`.
In a sense, [[Tools#Nmap|nmap]] is correct.
```Bash
$ psql --version
psql (PostgreSQL) 17.9 (Ubuntu 17.9-0ubuntu0.25.10.1)
```
# Basic Scripts

Scanning with the above methods is nice, however using scanning scripts is amazing for finding even more. 
Two of the most popular scripts are `-sC` and `-A`. 
Both provide similar results but I prefer the `-A` argument.
After running the scan with `-A`, we get even more details.
```Bash
$ nmap 192.168.12.187 -p 111,902,5432,27036,42765,57621 -sV -T5 -A
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-27 00:57 PDT
Nmap scan report for windows-PC.lan (192.168.12.187)
Host is up (0.000079s latency).

PORT      STATE SERVICE         VERSION
111/tcp   open  rpcbind         2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|_  100000  3,4          111/udp6  rpcbind
902/tcp   open  ssl/vmware-auth VMware Authentication Daemon 1.10 (Uses VNC, SOAP)
5432/tcp  open  postgresql      PostgreSQL DB 9.6.0 or later
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=alfredredbird-PC
| Subject Alternative Name: DNS:alfredredbird-PC
| Not valid before: 2025-06-21T07:57:41
|_Not valid after:  2035-06-19T07:57:41
27036/tcp open  ssl/steam       Valve Steam In-Home Streaming service (TLSv1.2 PSK)
42765/tcp open  unknown
| fingerprint-strings: 
|   NULL: 
|_    {"type":"Tier1","version":"1.0"}
57621/tcp open  unknown

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 35.48 seconds
```
After doing the scan with `-sC`we can see almost identical results.
```Bash
$ nmap 192.168.12.187 -p 111,902,5432,27036,42765,57621 -sV -T5 -sC
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-27 00:59 PDT
Nmap scan report for windows-PC.lan (192.168.12.187)
Host is up (0.000079s latency).

PORT      STATE SERVICE         VERSION
111/tcp   open  rpcbind         2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|_  100000  3,4          111/udp6  rpcbind
902/tcp   open  ssl/vmware-auth VMware Authentication Daemon 1.10 (Uses VNC, SOAP)
5432/tcp  open  postgresql      PostgreSQL DB 9.6.0 or later
| ssl-cert: Subject: commonName=alfredredbird-PC
| Subject Alternative Name: DNS:alfredredbird-PC
| Not valid before: 2025-06-21T07:57:41
|_Not valid after:  2035-06-19T07:57:41
|_ssl-date: TLS randomness does not represent time
27036/tcp open  ssl/steam       Valve Steam In-Home Streaming service (TLSv1.2 PSK)
42765/tcp open  unknown
| fingerprint-strings: 
|   NULL: 
|_    {"type":"Tier1","version":"1.0"}
57621/tcp open  unknown

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 35.52 seconds
```
---
How do you know which one to choose out of the two?
The `-sC` argument is built on [[Tools#Nmap|nmap's]] scripting engine and runs the default script.
It is the equivalent of `--script=default`.
The difference is with `-A`, it combines way more scans into one.
With it, we get `-sC + -sV + -O + --traceroute`
# Other Scripts

Running other scripts is quite simple. Just use the `--script=` argument
Example: `--script=default`
You can find more scripts here. 
https://nmap.org/nsedoc/scripts/
