# Pretext
TheHarvester is an [[Termonology#OSINT|OSINT]] tool that is good for scraping search engines and [[Termonology#DNS|DNS]] servers for emails.

# Scraping

By running the command `theHarvester`, it starts to scrape. 
The option `-d` is for the domain which I used `starbucks.com` and the other are straight forward. Now I did not have any API keys set, so I did run into some issues.
```Bash
$ theHarvester -d starbucks.com -l 500 -b all

Read proxies.yaml from /etc/theHarvester/proxies.yaml
*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___    /\  /\__ _ _ ____   _____  ___| |_ ___ _ __  *
* | __|  _ \ / _ \  / /_/ / _` | '__\ \ / / _ \/ __| __/ _ \ '__| *
* | |_| | | |  __/ / __  / (_| | |   \ V /  __/\__ \ ||  __/ |    *
*  \__|_| |_|\___| \/ /_/ \__,_|_|    \_/ \___||___/\__\___|_|    *
*                                                                 *
* theHarvester 4.8.2                                              *
* Coded by Christian Martorella                                   *
* Edge-Security Research                                          *
* cmartorella@edge-security.com                                   *
*                                                                 *
*******************************************************************

[*] Target: starbucks.com 

Read api-keys.yaml from /etc/theHarvester/api-keys.yaml

[!] Missing API key for bevigil. 
Read api-keys.yaml from /etc/theHarvester/api-keys.yaml
Read api-keys.yaml from /etc/theHarvester/api-keys.yaml
Read api-keys.yaml from /etc/theHarvester/api-keys.yaml
```

---

Still after some time, I was not able to find any good results. TheHarvester is quite old and possible depreciated but we should assume that it **could** work and possible find some good info.
```Bash
[*] Searching Bing. 
[*] Searching Baidu. 
An exception has occurred: 400, message:
  Can not decode content-encoding: br
        Searching results.
[*] Searching Certspotter. 
An exception has occurred: 502, message='Attempt to decode JSON with unexpected mimetype: text/html', url='https://crt.sh/?q=%25.starbucks.com&exclude=expired&deduplicate=Y&output=json'
[*] Searching CRTsh. 
[*] Searching Hackertarget. 
Error in HaveIBeenPwned search: Cannot serialize non-str key None
[*] Searching Haveibeenpwned. 
[*] Searching Leaklookup. 
[*] Searching Duckduckgo. 
[!] Missing API key for SecurityScorecard.

```