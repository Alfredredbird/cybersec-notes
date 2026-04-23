# Pretext
SSH or Secure Shell allows a user to login to a [[Termonology#Host|Host]] remotely and gain a shell.

# Login
SSH follows a format of username followed by the [[Termonology#IP|IP]] and command arguments.
```Bash
ssh (user)@(ip)
```
# RSA Login
You can login to a server via the RSA key file assuming your RSA key file matches the public key on the server.
RSA key files must have the permission `600` to execute. 
Changing the file permissions goes as follows.
```Bash
chmod 600 (rsa_key)
```
Logging into the server via the RSA key.
```Bash
ssh (user)@(ip) -i (rsa_file)
```
# Generate RSA Key Files
You can generate RSA key files with the correct permissions to possibly login to a machine via said key file and bypass some logins if done right. 
Running the following will prompt you to create the key
```Bash
ssh-keygen
```
Expected output if done correctly.
```Bash
The key fingerprint is:
SHA256:R25iM---------------r+Ipj050mC+JZZ0ic6RikbA alfredredbird@windows-PC
The key's randomart image is:
+--[ED25519 256]--+
|=... ...o.       |
|--= .o .         |
|EO.   +   .      |
|==X. . . o       |
|BX=oo   S +      |
|=B=.   . *       |
|== .             |
|===              |
|*=.              |
+----[SHA256]-----+
```
After running the command, you should be left with your RSA key file and your RSA public file.
It's important to change the permissions of the files to ensure [[Termonology#OpenSSH|OpenSSH]] will read the files.
```Bash
chmod 600 ~/.ssh/id_rsa  
chmod 644 ~/.ssh/id_rsa.pub
```
The contents of the RSA public file (id_rsa.pub) should be placed in the `.ssh` folder in the  users home directory.
```Bash
cat id_rsa.pub
echo 'PUBKEY' >> ~/.ssh/authorized_keys
```
Now when logging in with the RSA key file, you must supply the username of the user the key was given too.
# Decrypting RSA Files
Decrypting RSA files allows us to grab the password that the key file is encrypted with.
We can use [[Tools#JohnTheRipper|JohnTheRipper]] and [[Termonology#RockYou.txt|RockYou.txt]] or other word-lists.
First we get the hash with `ssh2john` and save it to a file called `hash`.
```Bash
ssh2john (id_rsa) > hash
```
Now it's as simple as decryption.
```Bash
john hash --wordlist=/usr/share/wordlists/rockyou.txt
```
Expected output should be similar. `123456` is our password. Logging in with [[SSH#RSA Login|the key]] will now prompt us for the password. 
```Bash
Will run 6 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
'123456'           (test)     
1g 0:00:00:01 DONE (2026-04-23 13:47) 0.6410g/s 30.76p/s 30.76c/s 30.76C/s 123456..1234567890
Use the "--show" option to display all of the cracked passwords reliably
Session completed. 
```
# Brute Forcing SSH Logins via Hydra
Brute forcing SSH logins is not a very optimal solution. 
However, it can be via [[Termonology#Hydra|Hydra]].
Example:
```Bash
hydra -l (Username) -P (pwd file) (IP) (protocol) -t (threads)
```
In this case, we are only testing one username so we can specify `-l`. 
A capital `-L` will allow us to supply a list of usernames.
```Bash
hydra -l Alfred -P /usr/share/wordlists/rockyou.txt 192.168.x.x ssh -t 4
```
#  Hiding From TTY
You can hide from the [[Termonology#who|who]] command as  it disables the pseudo terminal (TTY) allocation. Note that your connection can still be seen, just not from the [[Termonology#who|who]]command which makes this good for [[Termonology#CTF|CTF's]].
```
ssh (user)@(ip) -T
```
