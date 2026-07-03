# BOLT12 Pay

## Documentation

* [lndk-pay on GitHub](https://github.com/Alex71btc/lndk-pay#-bolt12-pay) — the upstream project.
* [LNDK](https://github.com/lndk-org/lndk) — the BOLT12 runtime BOLT12 Pay embeds.

## What you get on StartOS

* A **Web UI** for a self-hosted Lightning payment endpoint: create and pay **BOLT12 offers**, plus **LNURL**, **Lightning Address** (BIP353), and **BOLT11** support.
* An embedded **LNDK** runtime that talks to your StartOS **LND** node to handle BOLT12 offers and payments.

## Before you start: enable onion messages on LND

BOLT12 offers require onion-message support on your LND node.

You no longer need to edit `lnd.conf` by hand. When BOLT12 Pay starts, it posts a one-click task to your LND service. Open **LND** (or follow the prompt from BOLT12 Pay's dependency status) and approve LND's **Auto-Configure** task: LND writes the required onion-message settings (`protocol.custom-message=513`, `protocol.custom-nodeann=39`, `protocol.custom-init=39`) to `lnd.conf` for you.

The settings persist across LND restarts. The task clears automatically once they're set and reappears if they're ever removed, so you can always re-enable onion messages with one click. This requires an LND package recent enough to expose the Auto-Configure action.

### Requirements for BOLT12 offers

Creating BOLT12 offers also requires:

* at least one active public Lightning channel
* a fully synced LND node

Without onion messages enabled, the rest of the app still works, but BOLT12 offers will not function.

## Getting set up

1. Install and fully sync **LND**, then approve the onion-message task described above.
2. Install **BOLT12 Pay** and start it. It connects to LND automatically at `lnd.startos` using the read-only credentials mounted from the LND package — no macaroon copying required.
3. Open the **Web UI** interface.

## Public access (LNURL & Lightning Address)

LNURL, Lightning Address, and `.well-known` endpoints only resolve when BOLT12 Pay is reachable at a public hostname.

1. Give the **Web UI** a public address — a custom domain on clearnet, or a tunnel (e.g. the Cloudflare Tunnel package) if you can't forward ports.
2. Run the **Set Primary URL** action and choose that public address. BOLT12 Pay uses it as the base for LNURL and Lightning Address. Pick a clearnet/custom-domain URL — Tor and `.local` addresses won't resolve for external senders. (You can still override the base in the app's admin settings.)

For Tor or LAN-only use, BOLT12 offers and BOLT11 still work; only the public LNURL / Lightning Address flows need a public hostname.

### Domain configuration guide

When using Cloudflare DNS automation, Lightning Address (BIP353), or LNURL, make sure you understand the difference between:

* Cloudflare Zone Domain
* BIP353 Address Domain
* LNURL Domain/Subdomain

Detailed setup instructions:

https://github.com/Alex71btc/lndk-pay/blob/main/README.md#-domain-configuration-bip353-vs-lnurl

The guide includes:

* recommended domain structure
* root domain vs subdomain examples
* Cloudflare Zone configuration
* common setup mistakes

## Using BOLT12 Pay

The Web UI is the application itself — create offers, generate payment pages, and manage LNURL / Lightning Address settings. The upstream documentation applies once you're in.

