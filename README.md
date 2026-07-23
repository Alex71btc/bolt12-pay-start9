<p align="center">
  <img src="icon.png" alt="BOLT12 Pay Logo" width="21%">
</p>

# BOLT12 Pay on StartOS

> **Upstream:** <https://github.com/Alex71btc/lndk-pay>
>
> Everything not listed in this document should behave the same as upstream
> lndk-pay. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[BOLT12 Pay](https://github.com/Alex71btc/lndk-pay) is a self-hosted Lightning payment and identity server. It runs an embedded [LNDK](https://github.com/lndk-org/lndk) runtime to create and pay BOLT12 offers through your StartOS LND node, and adds LNURL, Lightning Address (BIP353), and BOLT11 support with a simple web UI.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                                                                                           |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| Image         | `main` — built from [`Dockerfile`](./Dockerfile) (upstream `app/` via the `upstream/` submodule + LNDK runtime) |
| Base          | `python:3.11-slim` + LNDK runtime from `alex71btc/lndk`                                                         |
| Architectures | x86_64, aarch64                                                                                                 |
| Entrypoint    | `/usr/local/bin/docker_entrypoint.sh` → `start.sh`                                                              |

The container runs two processes from [`assets/start.sh`](./assets/start.sh):

- **`uvicorn backend.app:app`** — the BOLT12 Pay web app on `0.0.0.0:8081`.
- **`lndk`** — a background loop that waits for LND to be reachable, then runs LNDK against it (gRPC on `127.0.0.1:7000`, used by the app for BOLT12 offers).

---

## Volume and Data Layout

| Volume | Mount Point | Purpose                                               |
| ------ | ----------- | ----------------------------------------------------- |
| `main` | `/data`     | App config, secrets, and LNDK data dir (`/data/lndk`) |

**Dependency mounts:**

- `/mnt/lnd` — LND volume (read-only) — for the TLS cert (`tls.cert`) and admin macaroon (`data/chain/bitcoin/mainnet/admin.macaroon`).

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose                  |
| --------- | ---- | -------- | ------------------------ |
| Web UI    | 8081 | HTTP     | BOLT12 Pay web interface |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains / clearnet (if configured)

For Lightning Address / LNURL / `.well-known` endpoints to resolve publicly, expose the Web UI on a public hostname and select it via the **Set Primary URL** action (see below).

---

## Actions (StartOS UI)

### Set Primary URL

| Property     | Value                                                                         |
| ------------ | ----------------------------------------------------------------------------- |
| ID           | `set-primary-url`                                                             |
| Visibility   | Enabled                                                                       |
| Availability | Any status                                                                    |
| Purpose      | Choose which non-local URL to advertise as the LNURL / Lightning Address base |

Pick one of the service's non-local URLs (use a **clearnet or custom-domain** URL — Tor and `.local` won't resolve for external senders). The selection is stored on the `startos` volume and injected on next start as the app's native `LNURL_BASE_URL`, `LNURL_BASE_DOMAIN`, `PUBLIC_LNURL_ADDRESS`, and `PUBLIC_BIP353_ADDRESS` env vars. These are **defaults** — the in-app admin settings still override them. If a previously-selected URL is later removed, StartOS posts a task to pick a new one.

---

## Dependencies

### LND (`lnd`)

| Property            | Value                                                                                                                                                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Required**        | Yes                                                                                                                                                                                                                                         |
| **Health checks**   | `lnd` must pass                                                                                                                                                                                                                             |
| **Mounted volumes** | `lnd:main` at `/mnt/lnd` (read-only) — TLS cert and admin macaroon                                                                                                                                                                          |
| **Reached at**      | LND's REST (`:8080`) and gRPC (`:10009`) over the StartOS LXC bridge — resolved from LND's `control`/`grpc` hosts and injected into `start.sh` as `LND_REST_URL` / `LND_GRPC_ADDRESS` (the `lnd.startos` DNS name is gone in StartOS 0.4.0) |
| **Purpose**         | Create and pay BOLT12 offers via LNDK                                                                                                                                                                                                       |

**Supports LND 0.20 and 0.21** (`>=0.20.1-beta:12`). BOLT12 offers need onion-message support, and how it is obtained depends on the LND version — so `startos/dependencies.ts` reads LND's installed version and posts the Auto-Configure task only where it is needed:

| Installed LND  | Onion messages                        | Auto-Configure task                                     |
| -------------- | ------------------------------------- | ------------------------------------------------------- |
| `>=0.21.0-beta:0` | Advertised natively (feature bit 39)  | Not posted; cleared if one already exists               |
| `<0.21.0-beta:0`  | Require the `protocol.custom-*` entries in `lnd.conf` | Posted as `critical` against LND's hidden `autoconfig` action |

Setting the `protocol.custom-*` entries on LND 0.21 is not merely redundant — LND aborts server creation (`feature bit: 39 already set`) and crash-loops. The version is read with `sdk.getServiceManifest(...).const()`, so upgrading LND from 0.20 to 0.21 re-runs init and clears the task instead of stranding the user with a critical task they cannot satisfy.

LND 0.21's config spec removes the `onion-messages` toggle altogether, so the typed `autoconfig` action we import can no longer describe the field. The task is therefore posted through the raw `effects.action.createTask` effect (same `replayId` the SDK helper would derive, `lnd:autoconfig`), whose input is the OS's untyped `TaskInput`.

See [instructions.md](./instructions.md) for the user-facing steps.

---

## Backups and Restore

**Included in backup:**

- `main` volume — app config, secrets, and LNDK data.

LND credentials are not backed up here; they live on the LND package and are re-mounted on restore.

---

## Health Checks

| Check  | Display Name | Method              | Messages                                                        |
| ------ | ------------ | ------------------- | --------------------------------------------------------------- |
| Web UI | "Web UI"     | Port 8081 listening | "BOLT12 Pay is ready" / "BOLT12 Pay web interface is not ready" |

---

## Limitations and Differences

1. **LND onion messages** — BOLT12 offers require onion-message support. LND provides it natively from 0.21; on LND 0.20 it is enabled through a one-click Auto-Configure task. BOLT12 Pay accepts LND `>=0.20.1-beta:12` and posts the task only to pre-0.21 nodes.
2. **LNURL base URL** — seeded from the **Set Primary URL** action; the in-app admin settings can still override it. All other app configuration is done inside the web UI.
3. **Mainnet only** — the LND macaroon path is pinned to `data/chain/bitcoin/mainnet`.

---

## Contributing

See [AGENTS.md](AGENTS.md) for repo conventions and the [StartOS packaging guide](https://docs.start9.com/packaging) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: bolt12-pay
image: main (built from Dockerfile; lndk-pay app/ submodule + LNDK runtime)
architectures:
  - x86_64
  - aarch64
volumes:
  main: /data
  startos: (StartOS metadata; not mounted into the container)
dependency_mounts:
  lnd: /mnt/lnd (read-only)
lnd_reached_at: LXC bridge (REST :8080, gRPC :10009), injected into start.sh as LND_REST_URL / LND_GRPC_ADDRESS
ports:
  ui: 8081
dependencies:
  - lnd (required, >=0.20.1-beta:12; onion messages native on 0.21, Auto-Configure task posted on 0.20)
actions:
  - set-primary-url
```
