# Pretext

Cryptography is the study of encryption and decryption. Cryptography often includes detecting [[Termonology#Hash|Hash]] types, reverse workflows or decryption it self. Cryptography can require a beefy computer depending on what attacks you need.

# Detecting Hash

Detecting [[Termonology#Hash|hashes]] is very important as attempting to decrypt a [[Termonology#Hash|hash]] with the wrong methods could leave you stuck.
We can detect our [[Termonology#Hash|hash]] several different ways via the web or tools.
The [[Termonology#Hash|hash]] we will attempt to decrypt is:
`185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969`.
We are going to use a tool called [[Tools#hashid|hashid]] and see what it thinks our [[Termonology#Hash|hash]] is.
```Bash
$ hashid 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969
Analyzing '185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969'
[+] Snefru-256 
[+] SHA-256 
[+] RIPEMD-256 
[+] Haval-256 
[+] GOST R 34.11-94 
[+] GOST CryptoPro S-Box 
[+] SHA3-256 
[+] Skein-256 
[+] Skein-512(256) 
```
We can see the output is pretty straight forward.
Now one thing to note is that[[Tools#hashid|hashid]] believes that our [[Termonology#Hash|hash]] uses the `Snefru-25` encryption.
This time it go it wrong as our [[Termonology#Hash|hash]] really uses `SHA-256` which is the second prediction.
Now because of this possibility, I prefer to use [hashes.com](https://hashes.com/en/tools/hash_identifier) as I find the results to be more accurate. Now we can see it got it correct on the first try.
![[crypt1.png]]
# Cracking Hash

There are many ways to crack a [[Termonology#Hash|hash]] but we will go with the basics.
If we find that our [[Termonology#Hash|hash]] is `MD5`,`SHA256` or other types that [CrackStation](https://crackstation.net/) supports, we can try to put the [[Termonology#Hash|hash]] in the site and maybe find a match.
![[crypt2.png|697]]
---
If the [[Termonology#Hash|hash]] is not on CrackStation, we can use other methods such as [[Tools#hashcat|Hashcat]] and [[Tools#JohnTheRipper|JohnTheRipper]].
For [[Tools#hashcat|Hashcat]] we can do whats called a [[Termonology#Word lists|wordlist]] attack where we use a [[Termonology#Word lists|wordlist]] to start testing the value.
```
hashcat -m 1400 -a 0 hash.txt rockyou.txt
```
We can use `-a 0` for a [[Termonology#Word lists|wordlist]] attack.
Another option would be to brute force. While brute forcing is not the most efficient, with enough time we can decrypt it,
```
hashcat -m 1400 -a 3 hash.txt ?a?a?a?a?a?a
```
We can see that by  doing a [[Termonology#Word lists|wordlist]] attack, I was able to recover our password from the [[Termonology#Hash|hash]] once again.
```Bash

Dictionary cache built:
* Filename..: rockyou.txt
* Passwords.: 14344392
* Bytes.....: 139921507
* Keyspace..: 14344385
* Runtime...: 2 secs

185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969:Hello
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 1400 (SHA2-256)
Hash.Target......: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d...381969
Time.Started.....: Thu Apr 30 10:02:44 2026 (0 secs)
Time.Estimated...: Thu Apr 30 10:02:44 2026 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:   190.4 MH/s (3.61ms) @ Accel:2048 Loops:1 Thr:32 Vec:1
```
---

# Cracking WiFi Handshake

