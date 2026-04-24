# Pretext

Other types of OSINT that I find would be best fit here as it's too simple for it's own page.

# Vehicle OSINT

The most we can do with vehicle OSINT is to do a VIN lookup or [[Geolocation#Reverse Image Search|Reverse image search]].

https://www.nhtsa.gov/vin-decoder
# Domain and Website OSINT

Domain OSINT is a simple as checking DNS records or the whois database with the Linux command [[Linux Commands#whois|whois]].
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
