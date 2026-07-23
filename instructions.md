# BOLT12 Pay

## Documentation

- [lndk-pay on GitHub](https://github.com/Alex71btc/lndk-pay#-bolt12-pay) — the upstream project.
- [LNDK](https://github.com/lndk-org/lndk) — the BOLT12 runtime BOLT12 Pay embeds.

## What you get on StartOS

- A **Web UI** for a self-hosted Lightning payment endpoint: create and pay **BOLT12 offers**, plus **LNURL**, **Lightning Address** (BIP353), and **BOLT11** support.
- An embedded **LNDK** runtime that talks to your StartOS **LND** node to handle BOLT12 offers and payments.

## Before you start

BOLT12 offers require onion-message support on your LND node. BOLT12 Pay works with **LND 0.20 and 0.21**, and handles the difference for you:

- **LND 0.21 or newer** — onion messages are advertised natively. There is nothing to configure and no setup task appears.
- **LND 0.20** — onion messages must be switched on in `lnd.conf`. BOLT12 Pay posts a one-click **Auto-Configure** task against LND; approve it and the setting is applied for you. No SSH or manual config editing.

If you later upgrade LND from 0.20 to 0.21, the task disappears on its own — LND 0.21 rejects the old override, so BOLT12 Pay stops asking for it.

### Requirements for BOLT12 offers

Creating BOLT12 offers also requires:

- at least one active public Lightning channel
- a fully synced LND node

## Getting set up

1. Install and fully sync **LND** (0.20 or newer).
2. Install **BOLT12 Pay** and start it. It connects to LND automatically over the internal network using the read-only credentials mounted from the LND package — no macaroon copying required.
3. Open the **Web UI** interface.

## Public access (LNURL & Lightning Address)

LNURL, Lightning Address, and `.well-known` endpoints only resolve when BOLT12 Pay is reachable at a public hostname.

1. Give the **Web UI** a public address — a custom domain on clearnet, or a tunnel (e.g. the Cloudflare Tunnel package) if you can't forward ports.
2. Run the **Set Primary URL** action and choose that public address. BOLT12 Pay uses it as the base for LNURL and Lightning Address. Pick a clearnet/custom-domain URL — Tor and `.local` addresses won't resolve for external senders. (You can still override the base in the app's admin settings.)

For Tor or LAN-only use, BOLT12 offers and BOLT11 still work; only the public LNURL / Lightning Address flows need a public hostname.

### Domain configuration guide

When using Cloudflare DNS automation, Lightning Address (BIP353), or LNURL, make sure you understand the difference between:

- Cloudflare Zone Domain
- BIP353 Address Domain
- LNURL Domain/Subdomain

Detailed setup instructions:

https://github.com/Alex71btc/lndk-pay/blob/main/README.md#-domain-configuration-bip353-vs-lnurl

The guide includes:

- recommended domain structure
- root domain vs subdomain examples
- Cloudflare Zone configuration
- common setup mistakes

## Using BOLT12 Pay

The Web UI is the application itself — create offers, generate payment pages, and manage LNURL / Lightning Address settings. The upstream documentation applies once you're in.
