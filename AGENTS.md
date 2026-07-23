# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `bolt12-pay`.** Dependent of `lnd`: it reaches LND's REST and gRPC over the LXC bridge (importing the host ids `controlHostId` / `gRPCHostId` and the internal ports `restPort` / `gRPCPort` from `lnd-startos/startos/interfaces`, resolved in `startos/utils.ts` through the reactive `bridgeAddress` helper — a `.const()` per host that heals main onto the real address when LND binds; while unresolved the env vars are omitted) and injects those addresses into `assets/start.sh` as `LND_REST_URL` / `LND_GRPC_ADDRESS` — the app and the embedded `lndk` read them from there (the `lnd.startos` DNS name is gone in StartOS 0.4.0). Reads LND's TLS cert + admin macaroon off a read-only dependency mount at `/mnt/lnd`.
- **Supports LND 0.20 and 0.21** (`>=0.20.1-beta:12`). BOLT12 needs onion messages: LND advertises them natively from 0.21, while 0.20 needs the `protocol.custom-*` entries in `lnd.conf`. Setting those on 0.21 crash-loops LND (`feature bit: 39 already set`), so `startos/dependencies.ts` reads LND's installed version via `sdk.getServiceManifest(...).const()` and posts the Auto-Configure task **only** to pre-0.21 nodes, clearing it when the user upgrades. LND 0.21's config spec drops the `onion-messages` toggle entirely, so the typed action we import can't describe the field — the task goes through the raw `effects.action.createTask` effect rather than `sdk.action.createTask`. Don't "simplify" that back to the typed helper, and don't re-pin the dependency to `>=0.21`.
- **Upstream is a git submodule at `upstream/`.** The image is built from its `app/` subdir by the `Dockerfile`; the container runs `assets/start.sh`, which starts the uvicorn web app on `0.0.0.0:8081` and a background `lndk` process serving gRPC on `127.0.0.1:7000`.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach bolt12-pay -n bolt12-pay-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `bolt12-pay-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
