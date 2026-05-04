# Pretext
WiFi Handshakes are the exchange of WiFi authentication packets that have the networks encrypted password in the capture.

# Capturing

# Decryption

In this example, I have a `PCAP` that I converted into `hash.22000`. We will use a tool called [[Tools#hashcat|hashcat]] to decrypt the password.
It is important to take note that decryption time might be quick or it might be long. It depends on what hardware you have.
[[Tools#hashcat|hashcat]] has a simple format `-m 22000` is our hash type and `-w 3 -O` are our optimizations.
I am using the `weakpass_wifi_1` [[Termonology#Word lists|Wordlist]] that is no longer available but any wordlists could work. This is a dictionary attack, see [[Cryptography#Cracking Hash|here]] for more details.
```Bash
alfredredbird@windows-PC:~/Downloads 80 files ⏱ 11.3s 
$ hashcat -m 22000 hash.22000 '/media/alfredredbird/2tb backup drive1/wordlists/weakpass_wifi_1/weakpass_wifi_1' -w 3 -O
hashcat (v6.2.6) starting

CUDA API (CUDA 13.0)
====================
* Device #1: NVIDIA GeForce RTX 3080, 6694/9871 MB, 68MCU

OpenCL API (OpenCL 3.0 CUDA 13.0.97) - Platform #1 [NVIDIA Corporation]
```