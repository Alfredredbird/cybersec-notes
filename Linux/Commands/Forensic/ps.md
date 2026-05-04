# Pretext

[[Linux Commands#ps|ps]] is a common [[Termonology#Linux|Linux]] command to list running processes. 
[[Linux Commands#ps|ps]] is similar to the task manager on windows, just fully CLI based.

# Understanding The Output

| Column  | Meaning                     |
| ------- | --------------------------- |
| USER    | Who owns the process        |
| PID     | Process ID                  |
| %CPU    | CPU usage                   |
| %MEM    | Memory usage                |
| VSZ     | Virtual memory size         |
| RSS     | Physical memory used        |
| TTY     | Terminal (or `?` if none)   |
| STAT    | Process state               |
| START   | When it started             |
| TIME    | CPU time used               |
| COMMAND | The command that started it |
# Basic Usages

By itself, [[Linux Commands#ps|ps]] is pretty powerful, but in my experience, [[Linux Commands#ps|ps]] can get even better if we combine it with other commands.
If we want to search for specific processes, we can combine it with [[Linux Commands#Grep|grep]].
```Bash
$ ps aux | grep firefox
alfredr+   31050  4.8  2.1 12113896 686680 ?     Sl   14:01   0:26 /snap/firefox/8054/usr/lib/firefox/firefox
alfredr+   31134  0.0  0.0 149384  2984 ?        Sl   14:01   0:00 /snap/firefox/8054/usr/lib/firefox/crashhelper 31050 9 /tmp/ 11
...
...
```
We can see from the output, there is a lot about the Firefox processes running. 
If we want to sort our processes by the most resources, it is quite simple.
For sorting by the most CPU usage we can do the following.
```Bash
$ ps aux --sort=-%cpu
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
alfredr+   32488 48.6  0.4 436392 156672 ?       Sl   14:12   0:00 /usr/bin/kitty
alfredr+    8943 16.7  1.8 1288364000 588688 ?   Sl   13:14   9:42 /usr/share/spotify/spotify 
```
It looks like the [[Termonology#Kitty|Kitty Terminal]] is taking up a lot of resources.
For checking the RAM usage.
```Bash
$ ps aux --sort=-%mem
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
alfredr+   31050  4.6  2.2 12144388 727408 ?     Sl   14:01   0:35 /snap/firefox/8054/usr/lib/firefox/firefox
alfredr+    5328  5.9  2.2 6509960 724740 ?      Rsl  12:57   4:32 /usr/bin/gnome-shell
```
If we want to check to see what processes is running by a user we can with the following command.
```Bash
$ ps u -U alfredredbird
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
alfredr+    5029  0.0  0.0  24348 14852 ?        Ss   12:57   0:01 /usr/lib/systemd/systemd --user
alfredr+    5031  0.0  0.0  23952  3908 ?        S    12:57   0:00 (sd-pam)
alfredr+    5053  0.0  0.0  11128  8152 ?        Ss   12:57   0:02 /usr/bin/dbus-daemon
```