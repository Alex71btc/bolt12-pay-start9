from pathlib import Path

p = Path("backend/app.py")
text = p.read_text(encoding="utf-8")

old_pubkey = """def _nostr_server_pubkey_hex() -> str:
    if not NOSTR_SERVER_PRIVKEY:
        return ""
    pk = coincurve.PrivateKey(_hex_to_bytes(NOSTR_SERVER_PRIVKEY))
    return pk.public_key.format(compressed=False).hex()[2:]
"""

new_pubkey = """def _nostr_server_pubkey_hex() -> str:
    if not NOSTR_SERVER_PRIVKEY:
        return ""
    pk = coincurve.PrivateKey(_hex_to_bytes(NOSTR_SERVER_PRIVKEY))
    compressed = pk.public_key.format(compressed=True).hex()
    return compressed[2:]
"""

if old_pubkey not in text:
    raise SystemExit("Could not find _nostr_server_pubkey_hex() block")

text = text.replace(old_pubkey, new_pubkey, 1)

old_event = """        event = {
            "kind": 9735,
            "created_at": int(time.time()),
            "tags": [
                ["p", item["recipient_pubkey_hex"]],
                ["bolt11", item["payment_request"]],
                ["amount", str(item["amount_msat"])],
            ],
            "content": ""
        }
"""

new_event = """        tags = [
            ["p", item["recipient_pubkey_hex"]],
            ["bolt11", item["payment_request"]],
            ["description", json.dumps({
                "kind": 9734,
                "pubkey": item.get("payer_pubkey_hex", ""),
                "tags": (
                    [["p", item["recipient_pubkey_hex"]]]
                    + ([["amount", str(item["amount_msat"])]] if item.get("amount_msat") else [])
                ),
                "content": "",
            }, separators=(",", ":"))],
        ]

        if item.get("amount_msat"):
            tags.append(["amount", str(item["amount_msat"])])

        event = {
            "kind": 9735,
            "created_at": int(time.time()),
            "tags": tags,
            "content": ""
        }
"""

if old_event not in text:
    raise SystemExit("Could not find zap receipt event block")

text = text.replace(old_event, new_event, 1)

p.write_text(text, encoding="utf-8")
print("Patched zap receipt pubkey format + receipt tags.")
