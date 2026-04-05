# BOLT12 Pay – Setup Guide

## Requirement: LND BOLT12

BOLT12 Pay requires **LND BOLT12** on StartOS.

- App name in StartOS: **LND BOLT12**
- Package ID: `lndbolt`

The default Start9 LND package does not support BOLT12 offers.

LND BOLT12 repository:
https://github.com/Alex71btc/lnd-startos-bolt12

## Migrate from official Start9 LND

If you already use the official Start9 LND, you can safely migrate your node state to **LND BOLT12**.

1. Stop both services:
   - LND
   - LND BOLT12

2. Open **LND BOLT12**
3. Go to:
   - Actions
   - Import from Start9 LND

4. Wait until the import completes

Important:
- Never run both nodes with the same wallet state at the same time
- After migration, keep the old LND stopped or uninstall it

Your node identity, channels, and funds are preserved.

## Remote Access

For secure remote access, use the FOSS Cloudflare Tunnel app for StartOS:

https://github.com/remcoros/cloudflared-startos/releases

Recommended:
- expose BOLT12 Pay through the tunnel
- protect `/pay` and `/pay-login`
- keep required public payment endpoints reachable

## Wallets and Clients

BOLT12 Pay works well together with:

- Zeus
- Alby
- Nostr Wallet Connect (NWC)

For Zeus with LND REST:
- use the Tor address shown in StartOS
- if needed, replace `http://` with `https://`

## Notes

- BOLT12 Pay requires **LND BOLT12**, not the default Start9 LND
- BOLT12 offers are provided through the LND BOLT12 + LNDK stack
- LNURL and Lightning Address support are included in BOLT12 Pay
