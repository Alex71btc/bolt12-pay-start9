#!/bin/sh
set -eu

mkdir -p /data

export APP_DATA_DIR=/data
export APP_CONFIG_PATH=/data/config.json
export CONFIG_JSON_PATH=/data/config.json
export SECRETS_JSON_PATH=/data/secrets.json

export HOST=0.0.0.0
export PORT=8081

# Start9/LND wiring will be refined once dependency mount/env details are confirmed.
# For MVP, allow manual override via env if needed.
export LNDK_NETWORK="${LNDK_NETWORK:-bitcoin}"
export LNDK_GRPC_HOST="${LNDK_GRPC_HOST:-https://127.0.0.1}"
export LNDK_GRPC_PORT="${LNDK_GRPC_PORT:-7000}"

echo "Starting BOLT12 Pay on ${HOST}:${PORT}"
exec python3 /app/backend/app.py
