# Pretext

Stenography is the concept of hiding files or documents in plain sight. Weather it's in a secret message, or a JPEG image, it can be recovered.

# Detecting Stenography

While at plain sight, you might not be able to see a hidden file or document in an image. 
But Stenography tools can.
A tool called [[Tools#Binwalk|Binwalk]] can however.
By running the following, we can extract an image or file from a JPEG.
```Bash
binwalk -e image.jpeg
```

# Steghide

[[Tools#Steghide|Steghide]] is a popular tool for embedding and extracting hidden data in an image.
Using the following command, will allow us to extract the hidden file assume we know the password.
```Bash
steghide extract -sf output.jpg
```
To embed a file, it's as simple as the following.
```Bash
steghide embed -cf image.jpg -ef secret.txt -sf output.jpg
```

# Stegcracker

In the event that you do not know the password to the steghide file, you can use a tool called [[Tools#stegcracker|Stegcracker]].
```Bash
stegcracker image.jpg /usr/share/wordlists/rockyou.txt
```
File extraction is not guaranteed.