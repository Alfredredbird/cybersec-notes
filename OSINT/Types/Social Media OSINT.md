# Pretext

This section will cover all the knowledge of Social Media OSINT that I know.
Social Media OSINT is the type of OSINT that is more focused on the social media aspect as the name suggests.

# The Methodology

The methodology behind OSINT is quite simple, start with what you know, use public sources to dive deeper and collect more info in a way to try to tie everything together. Based on your findings, you must decide what to investigate next. Along the way you will need to be able to verify your sources and make sure you are correct. 
# The Foothold

The `most` important thing in Social Media OSINT and OSINT in general is gathering a foothold. A foothold is starting piece of data that we can leverage to discover more.
Examples might include, a username, email, phone number etc.

# Username Reusing

Username Reusing is quite self explanatory, reusing the same name on different social media platforms. 
This is quite a common thing so we can use tools such as [[Tools#Tookie-osint|Tookie-OSINT]] or [[Tools#Sherlock|Sherlock]]. 
We will be using [[Tools#Tookie-osint|Tookie-OSINT]] and the username `Alfredredbird(me)`.
After a few seconds we end up with the following.
The majority of these usernames discovered do not belong to me and are what we call a false positive. 
There are other ways to verify if it's a false positive or not.
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
[+] https://www.7cups.com/@alfredredbird
[+] https://m.twitch.tv/alfredredbird
[+] https://archive.org/details/@alfredredbird
[+] https://anilist.co/user/alfredredbird
[+] https://www.facebook.com/alfredredbird
[+] https://www.codecademy.com/profiles/alfredredbird
[+] https://www.freelancer.com/u/alfredredbird
[+] https://www.flickr.com/people/alfredredbird
[+] https://www.gaiaonline.com/profiles/alfredredbird
[+] https://www.forumophilia.com/profile.php?mode=viewprofile&u=alfredredbird
[+] https://imgur.com/user/alfredredbird
```

# API's
More to come