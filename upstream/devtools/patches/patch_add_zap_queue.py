# patch_add_zap_queue.py
from pathlib import Path

p = Path("backend/app.py")
text = p.read_text()

if "pending[payment_hash]" in text:
    print("Already patched.")
    exit()

insert_block = """
        # --- ZAP QUEUE STORE -----------------------------------------
        if nostr:
            try:
                zap_request = json.loads(nostr)

                def _extract_relays(tags):
                    for t in tags:
                        if isinstance(t, list) and len(t) > 1 and t[0] == "relays":
                            return t[1:]
                    return []

                relays = _extract_relays(zap_request.get("tags", []))

                pending = _get_pending_zaps()

                pending[payment_hash] = {
                    "created_at": int(time.time()),
                    "recipient_pubkey_hex": recipient_nostr_hex,
                    "payer_pubkey_hex": zap_request.get("pubkey"),
                    "amount_msat": amount_msat,
                    "payment_request": payment_request,
                    "relays": relays,
                    "published": False,
                }

                _save_pending_zaps(pending)
                print("zap queued:", payment_hash)

            except Exception as e:
                print("zap queue error:", e)
        # -------------------------------------------------------------
"""

# sehr einfacher Ansatz: nach payment_request setzen
text = text.replace(
    "return {",
    insert_block + "\n        return {",
    1
)

p.write_text(text)
print("Patch applied.")
