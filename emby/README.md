# Access Emby Server

## Setup VPN
1. Signup for [Tailscale](https://login.tailscale.com/login) VPN.
2. Setup Tailscale VPN DNS.
Go to [DNS settings](https://login.tailscale.com/admin/dns).
3. On `Nameservers`, Add nameserver and choose `NextDNS`. Enter `caa372` and save.
4. Enable `Override local DNS`.
5. Download [Tailscale VPN](https://tailscale.com/download) for your device and sign in.
6. Open the invite link and accept the invitation.
7. You should now be able access [Emby Server](https://media.home.ph).

## Setup Emby for Mobile
1. Download Emby. Available for [Android](https://play.google.com/store/apps/details?id=com.mb.android)
 and [iOS](https://apps.apple.com/us/app/emby/id992180193).
2. Connect to Tailscale VPN.
3. Open Emby app, tap `Next` then `Skip`.
4. Enter host: `https://media.home.ph` and port: `443`.
<br>
<img src="https://immdav.github.io/emby/emby-server-config.png" alt="Emby server config" width="320">
5. Login with your Emby credentials.