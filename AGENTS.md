# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Resolve LND's addresses with `getBridgeAddress`, chained `.const()`, importing the host ids and ports from `lnd-startos/startos/interfaces`.** Don't read `net.assignedPort`/`assignedSslPort` directly: which of those is populated depends on how the dependency bound the port, and `getBridgeAddress` reads the binding's own derived address instead.
- **The onion-messages task must stay version-gated, and must stay on the raw effect.** Setting `protocol.custom-*` on LND 0.21 aborts server creation (`feature bit: 39 already set`) and crash-loops it, so `dependencies.ts` reads LND's installed version and posts the task only below 0.21, clearing it on upgrade. 0.21's config spec drops the `onion-messages` toggle entirely, so the typed action we import can no longer describe the field — hence `effects.action.createTask` with the same `replayId` the SDK helper would derive. Don't "simplify" it back to the typed helper.
  - **The declared `versionRange` has since moved above 0.21, so that branch is currently unreachable.** Either the range or the branch is redundant; decide deliberately rather than deleting the branch by assumption, since it is the only thing standing between a downgraded LND and a crash loop.
- **`store.json` lives on the `startos` volume, which is not mounted into the container and is not backed up.** That is what keeps the package's chosen URL out of the application's reach — but it also means the primary URL does not survive a restore. Don't move it to `main` to "fix" the backup without deciding whether the app should be able to see it.
