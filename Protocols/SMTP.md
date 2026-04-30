# Pretext

Simple Mail Transfer Protocol is used for sending email but not retrieving it.
[[Termonology#SMTP|SMTP]] usually runs on [[Termonology#Port|port]] `25`.

# A Basic Flow

[[Termonology#SMTP|SMTP]] will send out mail in a way that the receiving server can understand and read.
A simple [[Termonology#SMTP|SMTP]] session might go as follows.
In this case, `attacker@example.com` is our email address that is sending an email to `victim@example.com`
```Bash
HELO example.com  
MAIL FROM:<attacker@example.com>  
RCPT TO:<victim@example.com>  
DATA  
Subject: test  
  
Hello world  
.  
QUIT
```

# Banner Grabbing

We can often send packets to the [[Termonology#SMTP|SMTP Port]] in hopes that we can grab the banner to learn more about the [[Termonology#SMTP|SMTP]] version. 
[[Tools#Nmap|nmap]] usually does this for us when doing a basic scan, but we can test them manually.
```
nc target 25
or
nmap -sV -p25 target
```

# Open Relay Testing

If enabled, open relay lets you send mail through the [[Termonology#SMTP|SMTP]] server to anyone.
An example would be:
```
MAIL FROM:<attacker@evil.com>RCPT TO:<victim@gmail.com>
```
We can check it with the following [[Tools#Nmap|nmap]] script.
```
nmap --script smtp-open-relay -p25 target
```

I don't have an [[Termonology#SMTP|SMTP]] to provide any more examples with.