#!/bin/sh
set -eu

mkdir -p /data/lndk

LND_ADDRESS="${LND_ADDRESS:-https://lnd:10009}"
LND_CERT_PATH="${LND_CERT_PATH:-/lnd/tls.cert}"
LND_MACAROON_PATH="${LND_MACAROON_PATH:-/lnd/data/chain/bitcoin/mainnet/admin.macaroon}"
LNDK_DATA_DIR="${LNDK_DATA_DIR:-/data/lndk}"
LNDK_GRPC_HOST_BIND="${LNDK_GRPC_HOST_BIND:-0.0.0.0}"
LNDK_GRPC_PORT="${LNDK_GRPC_PORT:-7000}"

echo "Waiting for LND TLS + macaroon..."
while [ ! -f "${LND_CERT_PATH}" ] || [ ! -f "${LND_MACAROON_PATH}" ]; do
  echo "Waiting for cert/macaroon..."
  sleep 5
done

echo "Starting LNDK with retry loop..."
while true; do
  lndk \
    --address="${LND_ADDRESS}" \
    --cert-path="${LND_CERT_PATH}" \
    --macaroon-path="${LND_MACAROON_PATH}" \
    --data-dir="${LNDK_DATA_DIR}" \
    --grpc-host="${LNDK_GRPC_HOST_BIND}" \
    --grpc-port="${LNDK_GRPC_PORT}"

  echo "LNDK exited or failed. Retrying in 10s..."
  sleep 10
done
