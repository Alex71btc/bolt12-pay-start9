# BOLT12 Pay – Start9 Service

Start9 service packaging for BOLT12 Pay.

## Goal

Package BOLT12 Pay as a Start9 service using an existing LND service on StartOS.

## Planned architecture

- Start9 dependency: Bitcoin Core
- Start9 dependency: LND
- BOLT12 Pay web service
- LNDK support for BOLT12 offers and payments

## Repo structure

- `manifest.yaml` – service metadata
- `docker-compose.yml` – service containers
- `config.yaml` – Start9 config UI
- `actions.yaml` – Start9 actions
- `scripts/` – helper scripts
- `assets/` – icon and related assets
- `docker/` – optional custom Docker assets

## Status

Initial repository structure created.
