# Pretext

[[Tools#Tookie-osint|Tookie-OSINT]] that was written by me `(alfredredbird)` back in `2023`. [[Tools#Tookie-osint|Tookie-OSINT]] is quite similar to [[Tools#Sherlock|Sherlock]] as they both are username scanners. [[Tools#Tookie-osint|Tookie-OSINT]] offers more options and a webscraper compared to  [[Tools#Sherlock|Sherlock]].

# Installing

[[Tools#Tookie-osint|Tookie-OSINT]] has a few main ways to install it. We will focus on the Debian and generic Linux and MacOS install's.

## Debian Based
```
download debian packaged from
https://github.com/Alfredredbird/tookie-osint/releases

sudo dpgk -i tookie-osint.deb
```
## Generic Linux/MacOS
```
git clone https://github.com/alfredredbird/tookie-osint.git
cd tookie-osint
chmod +x install.sh
sudo ./install.sh
```
## # Other Installations
You can find more install instructions on the Wiki.
```
git clone https://github.com/alfredredbird/tookie-osint
cd tookie-osint
python3 -m venv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 brib.py
```

# Using Tookie-OSINT

Using [[Tools#Tookie-osint|Tookie-OSINT]] is pretty straight forward and quite self explanatory.
Running the command without and arguments will provide us with a basic description.
If we supply the argument `-h` we can get the full help menu.
```Bash
$ tookie-osint
usage: tookie-osint [-h] (-u USER | -U USERFILE) [-t THREADS] [-d] [-sk] [-p PROXY] [-W] [-o {txt,csv,json}] [-D DELAY] [-a] [-H]
tookie-osint: error: one of the arguments -u/--user -U/--userfile is required
```
---
```Bash
$ tookie-osint -h
usage: tookie-osint [-h] (-u USER | -U USERFILE) [-t THREADS] [-d] [-sk] [-p PROXY] [-W] [-o {txt,csv,json}] [-D DELAY] [-a] [-H]

Username OSINT scanner

options:
  -h, --help            show this help message and exit
  -u, --user USER       Username to scan
  -U, --userfile USERFILE
                        File path to username file
  -t, --threads THREADS
                        Threads. Defualt is 2
  -d, --debug           Allows debugging options
  -sk, --skipheaders    skips using random user agents
  -p, --proxy PROXY     proxy
  -W, --webscraper      Toggles uses the webscraper
  -o, --output {txt,csv,json}
                        Output format (txt, csv, json)
  -D, --delay DELAY     Delay webscraper should wait for the page to load
  -a, --all             Show all results (positive and negative)
  -H, --harvest         Webscrape data from the sites
```
---
Running the following command will let us do a basic username scan. 
The argument `-u` is for the username and the argument `-t 100` is for 100 threads.
```Bash
$ tookie-osint -u alfredredbird -t 100
```
An example of a scan will look it the following.
```Bash
                
                     Tookie-OSINT
                   By Alfredredbird        
                Twiter: @alfredredbird1                       
    ==============================================
    Target: alfredredbird
    User: 1/1
    CPU: x86_64
    OS: Linux
    System: windows-PC
    Python Version: 3.13.7
    Threads: 100
    Headers Loaded: 10485
    =============================================
[+] https://www.twitch.tv/alfredredbird
[+] https://archive.org/details/@alfredredbird
[+] https://m.twitch.tv/alfredredbird
[+] https://anilist.co/user/alfredredbird
[+] https://www.facebook.com/alfredredbird
```
