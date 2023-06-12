journalctl --vacuum-time=1s
find /var/log/ -name '*.1' -type f -exec gzip -v -n {} \;; journalctl --vacuum-time=1s;
