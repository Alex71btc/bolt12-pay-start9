# BOLT12 Pay – StartOS Service

Self-hosted Lightning payment and identity server with BOLT12 support for StartOS.

BOLT12 Pay combines:

- native BOLT12 offer creation and payment (via embedded LNDK)
- Lightning Address support (BIP353 + LNURL)
- BOLT11 fallback for compatibility
- Nostr Wallet Connect (NWC)
- self-hosted web UI

---

## Installation

This package is currently distributed via GitHub Releases only.

Releases:
https://github.com/Alex71btc/bolt12-pay-start9/releases

⚠️ Important:

- This package is **not available in the official StartOS Marketplace**
- Installation currently requires **manual sideloading**
- Use at your own risk
- Make sure you understand backup and restore before testing on production systems

---

# Option A — StartOS 0.4 Beta (Experimental)

This is the new experimental package for StartOS 0.4.

## Required LND Configuration (IMPORTANT)

Connect to your StartOS device via SSH and open:

```bash
nano /media/startos/data/package-data/volumes/lnd/data/main/lnd.conf
```

Add:

```ini
protocol.custom-message=513
protocol.custom-nodeann=39
protocol.custom-init=39
```

Then restart LND.

Without this, BOLT12 Offers will not work.

Creating BOLT12 offers requires at least one active public Lightning channel.

---

# Option B — StartOS 0.3.5.1 Stable

This remains the stable production path for Raspberry Pi users.

## Requirement: LND BOLT12

- App name in StartOS: **LND BOLT12**
- Package ID: `lndbolt`

The default Start9 LND package does not support BOLT12 offers.

Repository:
https://github.com/Alex71btc/lnd-startos-bolt12

## Migration from official Start9 LND

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

---

## Features

- BOLT12 Offers
- LNURL and Lightning Address
- BOLT11 fallback
- Nostr Wallet Connect (NWC)
- self-hosted web UI
