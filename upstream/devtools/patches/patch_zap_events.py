#!/usr/bin/env python3
from pathlib import Path

p = Path("backend/app.py")
text = p.read_text(encoding="utf-8")

if "zap publisher loop started" in text:
    print("Patch already applied")
    exit()

block = """

# ===== ZAP EVENT PUBLISHING =====

import asyncio
from contextlib import suppress

import coincurve
import websockets

def _hex_to_bytes(value: str) -> bytes:
    return bytes.fromhex((value or "").strip())

def _nostr_server_pubkey_hex() -> str:
    if not NOSTR_SERVER_PRIVKEY:
        return ""
    pk = coincurve.PrivateKey(_hex_to_bytes(NOSTR_SERVER_PRIVKEY))
    return pk.public_key.format(compressed=False).hex()[2:]

def _nostr_event_id_hex(event):
    payload = [
        0,
        event["pubkey"],
        event["created_at"],
        event["kind"],
        event["tags"],
        event["content"],
    ]
    raw = json.dumps(payload, separators=(",", ":"))
    return hashlib.sha256(raw.encode()).hexdigest()

def _sign_nostr_event(event):
    event = dict(event)
    event["pubkey"] = _nostr_server_pubkey_hex()
    event["id"] = _nostr_event_id_hex(event)

    privkey = coincurve.PrivateKey(_hex_to_bytes(NOSTR_SERVER_PRIVKEY))
    sig = privkey.sign_schnorr(bytes.fromhex(event["id"]), aux_randomness=b"\\x00"*32)
    event["sig"] = sig.hex()
    return event

async def _publish_nostr_event_to_relay(relay_url, event):
    try:
        async with websockets.connect(relay_url) as ws:
            await ws.send(json.dumps(["EVENT", event]))
            return {"relay": relay_url, "ok": True}
    except Exception as e:
        return {"relay": relay_url, "ok": False, "error": str(e)}

async def _publish_nostr_event(relays, event):
    return await asyncio.gather(*[
        _publish_nostr_event_to_relay(r, event) for r in relays
    ])

def _get_pending_zaps():
    cfg = load_config()
    return cfg.get("pending_zaps", {})

def _save_pending_zaps(data):
    cfg = load_config()
    cfg["pending_zaps"] = data
    save_config(cfg)

async def _lookup_invoice(payment_hash):
    macaroon_hex = _read_macaroon_hex(LND_MACAROON_PATH)
    headers = {"Grpc-Metadata-macaroon": macaroon_hex}
    async with httpx.AsyncClient(timeout=10, verify=False) as client:
        r = await client.get(f"{LND_REST_URL}/v1/invoice/{payment_hash}", headers=headers)
        return r.json()

async def _process_pending_zaps_once():
    pending = _get_pending_zaps()

    for k, item in list(pending.items()):
        if item.get("published"):
            continue

        inv = await _lookup_invoice(k)
        if not inv.get("settled"):
            continue

        event = {
            "kind": 9735,
            "created_at": int(time.time()),
            "tags": [
                ["p", item["recipient_pubkey_hex"]],
                ["bolt11", item["payment_request"]],
                ["amount", str(item["amount_msat"])],
            ],
            "content": ""
        }

        signed = _sign_nostr_event(event)
        relays = item.get("relays") or NOSTR_DEFAULT_RELAYS

        result = await _publish_nostr_event(relays, signed)

        item["published"] = True
        item["result"] = result
        pending[k] = item

    _save_pending_zaps(pending)

async def _zap_publisher_loop():
    while True:
        try:
            await _process_pending_zaps_once()
        except Exception as e:
            print("zap loop error", e)
        await asyncio.sleep(NOSTR_ZAP_POLL_INTERVAL)

@app.on_event("startup")
async def start_zap_loop():
    if NOSTR_SERVER_PRIVKEY:
        asyncio.create_task(_zap_publisher_loop())
        print("zap publisher loop started")

@app.get("/api/debug/pending-zaps")
def debug_zaps():
    return _get_pending_zaps()

# ===== END ZAP EVENTS =====
"""

# einfach ans Ende anhängen
text += block

p.write_text(text, encoding="utf-8")

print("Zap patch applied")
