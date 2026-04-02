#!/bin/sh
set -eu

mkdir -p /data
mkdir -p /data/config

export APP_DATA_DIR=/data
export APP_CONFIG_PATH=/data/config.json
export CONFIG_JSON_PATH=/data/config.json
export SECRETS_JSON_PATH=/data/config/secrets.json

export HOST=0.0.0.0
export PORT=8081
export PYTHONPATH=/app

# Web app talks to separate LNDK service
export LNDK_CLI="${LNDK_CLI:-/usr/local/bin/lndk-cli}"
export LNDK_NETWORK="${LNDK_NETWORK:-bitcoin}"
export LNDK_GRPC_HOST="${LNDK_GRPC_HOST:-https://lndk}"
export LNDK_GRPC_PORT="${LNDK_GRPC_PORT:-7000}"
export LNDK_CERT_PATH="${LNDK_CERT_PATH:-/data/lndk/tls-cert.pem}"
export LNDK_MACAROON_PATH="${LNDK_MACAROON_PATH:-/lnd/data/chain/bitcoin/mainnet/admin.macaroon}"
export LNDK_TIMEOUT_SECONDS="${LNDK_TIMEOUT_SECONDS:-30}"
export ALLOW_PAY_OFFER="${ALLOW_PAY_OFFER:-true}"

# Direct LND REST fallback
export LND_REST_URL="${LND_REST_URL:-https://lnd:8080}"
export LND_TLS_CERT_PATH="${LND_TLS_CERT_PATH:-/lnd/tls.cert}"
export LND_MACAROON_PATH="${LND_MACAROON_PATH:-/lnd/data/chain/bitcoin/mainnet/admin.macaroon}"
export LND_REST_INSECURE="${LND_REST_INSECURE:-true}"

# LNURL defaults
export LNURL_MIN_SENDABLE_MSAT="${LNURL_MIN_SENDABLE_MSAT:-1000}"
export LNURL_MAX_SENDABLE_MSAT="${LNURL_MAX_SENDABLE_MSAT:-1000000000}"
export LNURL_COMMENT_ALLOWED="${LNURL_COMMENT_ALLOWED:-120}"
export LNURL_ALIAS_MODE="${LNURL_ALIAS_MODE:-shared}"
export LNURL_SHARED_DESCRIPTION="${LNURL_SHARED_DESCRIPTION:-LNURL payment}"
export LNURL_DEFAULT_DESCRIPTION="${LNURL_DEFAULT_DESCRIPTION:-Lightning payment}"
export LNURL_ALIAS_MAP="${LNURL_ALIAS_MAP:-}"

cd /app

echo "Starting BOLT12 Pay on ${HOST}:${PORT}"
exec uvicorn backend.app:app --host "${HOST}" --port "${PORT}"
