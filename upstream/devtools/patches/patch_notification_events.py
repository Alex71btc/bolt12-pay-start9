from pathlib import Path

p = Path("backend/app.py")
text = p.read_text(encoding="utf-8")

if "_build_notification_event(" in text:
    raise SystemExit("Notification patch seems already applied")

insert_after = """async def _publish_nostr_event(relays, event):
    return await asyncio.gather(*[
        _publish_nostr_event_to_relay(r, event) for r in relays
    ])
"""

block = """

def _build_notification_event(item, settled_invoice):
    amount_msat = int(item.get("amount_msat") or 0)
    amount_sat = amount_msat // 1000 if amount_msat else 0
    comment = (item.get("comment") or "").strip()
    identifier = item.get("identifier") or "your address"
    is_zap = bool(item.get("is_zap"))

    if is_zap and comment:
        content = f"⚡ Zap received on {identifier}: {amount_sat} sats • {comment}"
    elif is_zap:
        content = f"⚡ Zap received on {identifier}: {amount_sat} sats"
    else:
        content = f"⚡ Lightning payment received on {identifier}: {amount_sat} sats"

    tags = [
        ["p", item["recipient_pubkey_hex"]],
    ]

    payer = item.get("payer_pubkey_hex")
    if payer:
        tags.append(["P", payer])

    if amount_msat:
        tags.append(["amount", str(amount_msat)])

    if comment:
        tags.append(["comment", comment])

    return {
        "kind": 1,
        "created_at": int(time.time()),
        "tags": tags,
        "content": content,
    }
"""

if insert_after not in text:
    raise SystemExit("Could not find publish event helper block")

text = text.replace(insert_after, insert_after + block, 1)

old = """        signed = _sign_nostr_event(event)
        relays = item.get("relays") or NOSTR_DEFAULT_RELAYS

        result = await _publish_nostr_event(relays, signed)

        item["published"] = True
        item["result"] = result
        pending[k] = item
"""

new = """        signed = _sign_nostr_event(event)
        relays = item.get("relays") or NOSTR_DEFAULT_RELAYS

        result = await _publish_nostr_event(relays, signed)

        notification_event = _build_notification_event(item, inv)
        signed_notification = _sign_nostr_event(notification_event)
        notification_result = await _publish_nostr_event(relays, signed_notification)

        item["published"] = True
        item["result"] = result
        item["notification_result"] = notification_result
        item["notification_event"] = signed_notification
        pending[k] = item
"""

if old not in text:
    raise SystemExit("Could not find publish block in _process_pending_zaps_once()")

text = text.replace(old, new, 1)

p.write_text(text, encoding="utf-8")
print("Patched notification events.")
