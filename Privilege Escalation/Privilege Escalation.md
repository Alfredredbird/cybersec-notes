# Pretext
Basic commands and methods to investigate [[Termonology#Privilege Escalation|Privilege Escalation]].
# SUID File Search
Both search all the files in root directory for [[Termonology#SUID|SUID]] files.
```Bash
find / -type f -perm -u+s -exec ls -l {} \; 2>/dev/null
```
---
```Bash
find / -perm -4000 2>/dev/null
```
# CronJobs
## Read CronTab file
The CronTab file contains info about the [[Termonology#CronJobs|CronJobs]] running on the [[Termonology#Host|Host]].
```Bash
cat /etc/crontab
```
## View CronJobs
Displays the active [[Termonology#CronJobs|CronJobs]] for the logged in user. Most of the time you need credentials to view it. See [[Privilege Escalation#Read CronTab file|Here]] for a possible bypass.
```Bash
crontab -l
```
# Processes
## List Processes
Lists all the active processes and sub-processes.
```Bash
ps -A (all)
```
---
```Bash
ps axjf (all tree)
```

# GTFO-Bins

GTFO-Bins or `Get The Fuck Out Binaries` is an amazing website that hosts tons of ways to privilege escalate with vulnerabilities.
https://gtfobins.github.io/