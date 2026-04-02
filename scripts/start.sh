#!/bin/sh
set -eu
echo "START9 LNDK SCRIPT V2"

mkdir -p /data
mkdir -p /data/lndk
mkdir -p /data/config

export APP_DATA_DIR=/data
export APP_CONFIG_PATH=/data/config.json
export CONFIG_JSON_PATH=/data/config.json
export SECRETS_JSON_PATH=/data/config/secrets.json

export HOST=0.0.0.0
export PORT=8081
export PYTHONPATH=/app
export LND_DIR=/mnt/lnd

# BOLT12 Pay -> local LNDK gRPC
export LNDK_CLI=/usr/local/bin/lndk-cli
export LNDK_NETWORK=bitcoin
export LNDK_GRPC_HOST=https://127.0.0.1
export LNDK_GRPC_PORT=7000
export LNDK_CERT_PATH=/data/lndk/tls-cert.pem
export LNDK_MACAROON_PATH=$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon
export LNDK_TIMEOUT_SECONDS=30
export ALLOW_PAY_OFFER=true

# Direct LND REST fallback
export LND_REST_URL=https://lnd:8080
export LND_TLS_CERT_PATH=$LND_DIR/tls.cert
export LND_MACAROON_PATH=$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon
export LND_REST_INSECURE=true

# LNURL defaults
export LNURL_MIN_SENDABLE_MSAT=1000
export LNURL_MAX_SENDABLE_MSAT=1000000000
export LNURL_COMMENT_ALLOWED=120
export LNURL_ALIAS_MODE=shared
export LNURL_SHARED_DESCRIPTION="LNURL payment"
export LNURL_DEFAULT_DESCRIPTION="Lightning payment"
export LNURL_ALIAS_MAP=""

echo "Waiting for LND TLS + macaroon..."
while [ ! -f "$LND_DIR/tls.cert" ] || [ ! -f "$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon" ]; do
  echo "Waiting for cert/macaroon..."
  sleep 5
done

echo "Checking binaries..."
command -v lndk
command -v lndk-cli

echo "Checking mounted LND files..."
ls -l "$LND_DIR" || true
ls -l "$LND_DIR/data/chain/bitcoin/mainnet" || true

echo "Starting LNDK with retry loop..."
(
  while true; do
    lndk \
      --address=https://lnd:10009 \
      --cert-path="$LND_DIR/tls.cert" \
      --macaroon-path="$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon" \
      --data-dir=/data/lndk \
      --grpc-host=0.0.0.0 \
      --grpc-port=7000

    echo "LNDK exited or failed. Retrying in 10s..."
    sleep 10
  done
) &

cd /app

echo "Starting BOLT12 Pay on ${HOST}:${PORT}"
exec uvicorn backend.app:app --host "${HOST}" --port "${PORT}"
