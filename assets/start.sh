#!/bin/sh
set -eu

echo "START9 BOLT12 PAY SCRIPT"

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

# LND is a required StartOS dependency, reached over the StartOS LXC bridge.
# LND_REST_URL (REST) and LND_GRPC_ADDRESS (gRPC) are injected by the StartOS
# service — its `lnd.startos` DNS name is gone. Its data directory (TLS cert +
# macaroons) is mounted read-only at /mnt/lnd.
export LND_DIR=/mnt/lnd
export LND_TLS_CERT_PATH="$LND_DIR/tls.cert"
export LND_MACAROON_PATH="$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon"
export LND_REST_INSECURE=true

export LNDK_CLI=/usr/local/bin/lndk-cli
export LNDK_NETWORK=bitcoin
export LNDK_GRPC_HOST=https://127.0.0.1
export LNDK_GRPC_PORT=7000
export LNDK_CERT_PATH=/data/lndk/tls-cert.pem
export LNDK_MACAROON_PATH="$LND_MACAROON_PATH"
export LNDK_TIMEOUT_SECONDS=30
export ALLOW_PAY_OFFER=true

export LNURL_MIN_SENDABLE_MSAT=1000
export LNURL_MAX_SENDABLE_MSAT=1000000000
export LNURL_COMMENT_ALLOWED=120
export LNURL_ALIAS_MODE=shared
export LNURL_SHARED_DESCRIPTION="LNURL payment"
export LNURL_DEFAULT_DESCRIPTION="Lightning payment"
export LNURL_ALIAS_MAP=""

export PAY_UI_COOKIE_SECURE=true

echo "Checking binaries..."
command -v lndk
command -v lndk-cli
command -v curl

echo "Waiting for LND TLS cert and macaroon at ${LND_DIR}..."
while [ ! -f "$LND_TLS_CERT_PATH" ] || [ ! -f "$LND_MACAROON_PATH" ]; do
  echo "Waiting for cert/macaroon from lnd..."
  sleep 5
done

echo "Starting LNDK background loop against ${LND_GRPC_ADDRESS}..."
(
  while true; do
    if ! curl -ksS --connect-timeout 3 "${LND_REST_URL}/v1/getinfo" >/dev/null 2>&1; then
      echo "LND REST not ready yet at ${LND_REST_URL}, retrying..."
      sleep 5
      continue
    fi

    echo "Starting LNDK against ${LND_GRPC_ADDRESS}..."
    lndk \
      --address="${LND_GRPC_ADDRESS}" \
      --cert-path="$LND_TLS_CERT_PATH" \
      --macaroon-path="$LND_MACAROON_PATH" \
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
