# Pretext
Basic examples and practices for reverse engineering.

# Quick External Probes 

```bash
# quick binary metadata
file wrecked
rabin2 -I wrecked     # high-level info (arch, bits, libs, entry)
readelf -h wrecked    # ELF header
readelf -s wrecked    # symbol table
ldd ./wrecked          # dynamic libs (if runnable on your system)
strings wrecked | less  # obvious strings
```
