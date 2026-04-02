#!/bin/sh
set -eu

if wget -q -O - http://127.0.0.1:8081/api/health >/dev/null 2>&1; then
  printf '{"status":"passing","message":"BOLT12 Pay web API is responding"}\n'
else
  printf '{"status":"failing","message":"BOLT12 Pay web API is not responding"}\n'
  exit 1
fi
