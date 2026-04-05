# BOLT12 Pay – StartOS Service

Self-hosted Lightning payment and identity server with BOLT12 support for StartOS.

## Installation

This package is currently distributed via GitHub Releases only.

Releases:
https://github.com/Alex71btc/bolt12-pay-start9/releases

⚠️ Important:
- This package is **not available in the official Start9 Marketplace**
- Installation currently requires **manual sideloading**
- Use at your own risk
- Make sure you understand how to back up and restore your node before testing on production systems

## Requirement: LND BOLT12

BOLT12 Pay requires **LND BOLT12**.

- App name in StartOS: **LND BOLT12**
- Package ID: `lndbolt`

The default Start9 LND package does not support BOLT12 offers.

LND BOLT12 repository:
https://github.com/Alex71btc/lnd-startos-bolt12

## Migration from official Start9 LND

Existing users of the standard Start9 LND can migrate safely to **LND BOLT12**.

In StartOS:

1. Stop both:
   - LND
   - LND BOLT12

2. Open **LND BOLT12**
3. Run:
   - Actions → Import from Start9 LND

This preserves:
- node identity
- channels
- funds

Important:
- never run both nodes with the same state at the same time
- after migration, keep the old LND stopped or remove it

## Features

- BOLT12 Offers
- LNURL and Lightning Address
- BOLT11 fallback
- Nostr Wallet Connect (NWC)
- self-hosted web UI

## Remote access

Recommended FOSS Cloudflare Tunnel app for StartOS:
https://github.com/remcoros/cloudflared-startos/releases

Recommended setup:
- expose BOLT12 Pay through the tunnel
- protect /pay and /pay-login
- keep public payment endpoints reachable

## Build

make clean
make

This generates:

bolt-pay.s9pk
