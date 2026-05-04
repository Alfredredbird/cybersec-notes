# Pretext

[[Linux Commands#ifconfig|ifconfig]] is a [[Termonology#UNIX|UNIX]] command to check the wireless interface cards connected.
[[Linux Commands#ifconfig|ifconfig]] can change interfaces and configure [[Termonology#IP|IP's]]. 
Note that [[Linux Commands#ifconfig|ifconfig]] is considered to be deprecated.

# Installing

Some systems do not have [[Linux Commands#ifconfig|ifconfig]] installed by default and I often forget it.
We can install it with the following way's based on your distro.
### Debian / Ubuntu:
```
sudo apt update
sudo apt install net-tools
```
### Arch Linux:
```
sudo pacman -S net-tools
```

# Viewing Network Interfaces

We can view our network interfaces by running the command in the terminal.
Expected output should be similar but never exact.
We can see from the output, that `lo` is my loop back address usually for `localhost` and `enp42s0` is the name of my Ethernet adapter.
If you have a wireless card built in, it will often be called `wlan0` but not always.
```Bash
alfredredbird@windows-PC:~ 117 files 
$ ifconfig
enp42s0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.12.187  netmask 255.255.255.0  broadcast 192.168.12.255
        ether d8:bb:--:--:--:f1  txqueuelen 1000  (Ethernet)
        RX packets 2162319  bytes 1801429013 (1.8 GB)
        RX errors 0  dropped 6772  overruns 0  frame 0
        TX packets 627630  bytes 137778503 (137.7 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 3625  bytes 337620 (337.6 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3625  bytes 337620 (337.6 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```
If we want to see only one network card, we can run the same command with the name of the network card.
Keep in mind, the outputs might change depending on the card.
```Bash
alfredredbird@windows-PC:~ 117 files ⏱ 3.3s 
$ ifconfig wlo1
wlo1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.12.161  netmask 255.255.255.0  broadcast 192.168.12.255
        inet6 fe80::----:----:b5c0:7a0  prefixlen 64  scopeid 0x20<link>
        inet6 2607:----:----:53ed:4bc7:d58d:----:e555  prefixlen 64  scopeid 0x0<global>
        inet6 2607:fb90:4a28:----:3cfa:----:1f86:6661  prefixlen 64  scopeid 0x0<global>
        inet6 2607:----:4a28:----:8060:----:0:30e  prefixlen 128  scopeid 0x0<global>
        ether 88:--:2e:--:de:f1  txqueuelen 1000  (Ethernet)
        RX packets 70216  bytes 51104145 (51.1 MB)
        RX errors 0  dropped 7386  overruns 0  frame 0
        TX packets 36055  bytes 14908912 (14.9 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

# Assigning an IP Address

We can assign an [[Termonology#IP|IP]] to our network cards when we are connected to a network.
In this example, `eth0` is our Ethernet card.
```
sudo ifconfig eth0 192.168.1.50
```
We can also set a custom network mask as well.
```
sudo ifconfig eth0 192.168.1.50 netmask 255.255.255.0
```

# Enabling and Disabling Interfaces

To set or "turn on" our network card, we can running the following command with the right card name.
```
sudo ifconfig eth0 up
```
To set the card down, it is the same.
```
sudo ifconfig eth0 down
```