# Pretext

This page has the basics of domain and website [[Termonology#OSINT]]. This will cover grabbing domain records such as register, contacts, and IP's.
# Domain (whois)

Domain OSINT is a simple as checking [[Termonology#DNS|DNS]] records or the whois database with the Linux command [[Linux Commands#whois|whois]].
Example:
```Bash
whois example.com
   Domain Name: EXAMPLE.COM
   Registry Domain ID: 2336799_DOMAIN_COM-VRSN
   Registrar WHOIS Server: whois.iana.org
   Registrar URL: http://res-dom.iana.org
   Updated Date: 2026-01-16T18:26:50Z
   Creation Date: 1995-08-14T04:00:00Z
   Registry Expiry Date: 2026-08-13T04:00:00Z
   Registrar: RESERVED-Internet Assigned Numbers Authority
   Registrar IANA ID: 376
   Registrar Abuse Contact Email:
   Registrar Abuse Contact Phone:
   Domain Status: clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited
   Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
   Domain Status: clientUpdateProhibited https://icann.org/epp#clientUpdateProhibited
   Name Server: ELLIOTT.NS.CLOUDFLARE.COM
   Name Server: HERA.NS.CLOUDFLARE.COM
   DNSSEC: signedDelegation
   DNSSEC DS Data: 2371 13 2 C988EC423E3880EB8DD8A46FE06CA230EE23F35B578D64E78B29C3E1C83D245A
   URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
```

# DNS Records

We can look at more domain records with a command called [[Linux Commands#nslookup|nslookup]].
```Bash
nslookup example.com
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
Name:	example.com
Address: 104.20.23.154
Name:	example.com
Address: 172.66.147.243
Name:	example.com
Address: 2606:4700:10::ac42:93f3
Name:	example.com
Address: 2606:4700:10::6814:179a
```
After running the command, it returns [[Termonology#IPv4|IPv4]] and [[Termonology#IPv6|IPv6]]  [[Termonology#IP|IP's]], as well as the  [[Termonology#IP|IP]], of our [[Termonology#DNS|DNS]] server.
Running [[Linux Commands#nslookup|nslookup]] without arguments will prompt us with a simple `>` as seen below.
```Bash
$ nslookup
> 
```
With this, we can also check for email servers running on the domain by specifying `set type=mx`.  
```Bash
$ nslookup
> set type=mx
> bulbsecurity.com
Server:		127.0.0.53
Address:	127.0.0.53#53

Non-authoritative answer:
bulbsecurity.com	mail exchanger = 40 aspmx2.googlemail.com.
bulbsecurity.com	mail exchanger = 50 aspmx3.googlemail.com.
bulbsecurity.com	mail exchanger = 20 alt1.aspmx.l.google.com.
bulbsecurity.com	mail exchanger = 30 alt2.aspmx.l.google.com.
bulbsecurity.com	mail exchanger = 10 aspmx.l.google.com.

Authoritative answers can be found from:
> 
```

# Zone Transfers

[[Termonology#DNS|DNS]] zone transfers are a vulnerability that allows people to transfer name server entries.
We can run the Linux command [[Linux Commands#host|host]] to grab the host name of a domain.
```Bash
$ host -t ns example.com
example.com name server hera.ns.cloudflare.com.
example.com name server elliott.ns.cloudflare.com.
```
The option `-t ns` sets the domain that we want to scan.