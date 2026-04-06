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

export LND_DIR=/mnt/lnd
export LND_HOST_CANDIDATE=lndbolt.embassy

export LNDK_CLI=/usr/local/bin/lndk-cli
export LNDK_NETWORK=bitcoin
export LNDK_GRPC_HOST=https://127.0.0.1
export LNDK_GRPC_PORT=7000
export LNDK_CERT_PATH=/data/lndk/tls-cert.pem
export LNDK_MACAROON_PATH="$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon"
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

echo "Checking mounted LND files..."
ls -l "$LND_DIR" || true

if [ ! -f "$LND_DIR/tls.cert" ] || [ ! -f "$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon" ]; then
  echo "Missing tls.cert or admin.macaroon in $LND_DIR"
  sleep 10
  exit 1
fi

detect_lnd_host() {
  echo "Trying DNS host: ${LND_HOST_CANDIDATE}" >&2
  if curl -ksS --connect-timeout 3 "https://${LND_HOST_CANDIDATE}:8080/v1/getinfo" >/dev/null 2>&1; then
    printf '%s\n' "${LND_HOST_CANDIDATE}"
    return 0
  fi

  echo "DNS host not reachable, scanning Docker subnet for LND..." >&2
  python3 - <<'PY'
import socket

for i in range(2, 255):
    host = f"172.18.0.{i}"
    s = socket.socket()
    s.settimeout(0.2)
    try:
        s.connect((host, 10009))
        print(host)
        break
    except Exception:
        pass
    finally:
        s.close()
PY
}

LND_HOST="$(detect_lnd_host | tail -n 1)"

if [ -z "${LND_HOST:-}" ]; then
  echo "Could not detect reachable LND host"
  sleep 10
  exit 1
fi

echo "Using LND host: $LND_HOST"

export LND_REST_URL="https://${LND_HOST}:8080"
export LND_TLS_CERT_PATH="$LND_DIR/tls.cert"
export LND_MACAROON_PATH="$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon"
export LND_REST_INSECURE=true

echo "Starting LNDK background loop..."
(
  while true; do
    echo "Checking mounted LND files..."
    ls -l "$LND_DIR" || true

    if [ ! -f "$LND_DIR/tls.cert" ] || [ ! -f "$LND_DIR/data/chain/bitcoin/mainnet/admin.macaroon" ]; then
      echo "Waiting for cert/macaroon from lndbolt..."
      sleep 5
      continue
    fi

    echo "Waiting for LND REST to respond on ${LND_HOST}..."
    if ! curl -ksS --connect-timeout 3 "${LND_REST_URL}/v1/getinfo" >/dev/null 2>&1; then
      echo "LND REST not ready yet on ${LND_HOST}"
      sleep 5
      continue
    fi

    echo "Starting LNDK against ${LND_HOST}..."
    lndk \
      --address="https://${LND_HOST}:10009" \
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
