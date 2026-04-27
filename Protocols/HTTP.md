# Pretext
[[Termonology#HTTP|HTTP]] or `Typertext Transfer Protocol` is a popular web protocol that is used by websites to server web pages or files. [[Termonology#HTTP|HTTP]] operates on the Client-Server model and handles every request as it's very on interaction.

# HTTP VS HTTPS

HTTPS is encrypted with an `SSL` certificate that sends a public key to the clients browser to encrypt the messages being sent during the connection.
[[Termonology#HTTP|HTTP]] does not do any encryption and all messages are sent un-encrypted. 
# Python HTTP Server

Running [[Code Languages#Python|Python]] HTTP Servers are great for transferring files between machine.
Assuming the [[Termonology#Host|Host]] machine has [[Code Languages#Python|Python]] installed, you should be ready to get started.
Running the following command in the terminal will spawn a quite HTTP server.
The server will have access to the files and folders in the current working directory.
By default, the [[Termonology#Port|Port]] will be set to `8000` but can be changed by adding on the desired number. 
```Bash
$ python3 -m http.server 8000
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```
After doing an [[Tools#Nmap|NMap]] scan, we can see that the [[Code Languages#Python|Python]] server is up and running.
```Bash
$ nmap -sV -T5 -p 8000 192.168.12.187
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-26 12:10 PDT
Nmap scan report for windows-PC.lan (192.168.12.187)
Host is up (0.000068s latency).

PORT     STATE SERVICE VERSION
8000/tcp open  http    SimpleHTTPServer 0.6 (Python 3.13.7)
```
---
```Bash
$ pwd
/home/alfredredbird/obsidain osint/CyberNotes/Cyber Notes/Termonology
$ ls
 'Code Languages'  Commands  Scripts  Termonology.md  Tools
```
In my current working Directory, we have a few files. I'm interested in grabbing the `Termonology.md` file from my victim machine. 
We can do so by visiting `http://IP:PORT/FILE`. We will be getting the file with `wget`.
```Bash
$ wget http://192.168.12.187:8000/Termonology.md
--2026-04-26 12:07:32--  http://192.168.12.187:8000/Termonology.md
Connecting to 192.168.12.187:8000... connected.
HTTP request sent, awaiting response... 200 OK
Length: 2171 (2.1K) [text/markdown]
Saving to: ‘Termonology.md’

Termonology.md                      100%[================================================================>]   2.12K  --.-KB/s    in 0s      

2026-04-26 12:07:32 (597 MB/s) - ‘Termonology.md’ saved [2171/2171]
```
Back in our [[Code Languages#Python|Python]] Server terminal, we can see we got a response back letting us know that someone was able to grab the file.
```Bash
$ python3 -m http.server
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
192.168.12.187 - - [26/Apr/2026 12:07:32] "GET /Termonology.md HTTP/1.1" 200 -
```
