#!/bin/sh
set -eu

mkdir -p /data

export APP_DATA_DIR=/data
export APP_CONFIG_PATH=/data/config.json
export CONFIG_JSON_PATH=/data/config.json
export SECRETS_JSON_PATH=/data/secrets.json

export HOST=0.0.0.0
export PORT=8081
export PYTHONPATH=/app

cd /app

echo "Starting BOLT12 Pay on ${HOST}:${PORT}"
exec uvicorn backend.app:app --host "${HOST}" --port "${PORT}"
