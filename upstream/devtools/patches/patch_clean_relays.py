from pathlib import Path

p = Path("backend/app.py")
text = p.read_text(encoding="utf-8")

needle = """def _get_pending_zaps():
    cfg = load_config()
    return cfg.get("pending_zaps", {})
"""

replacement = """def _normalize_relays(relays):
    out = []
    seen = set()

    for relay in relays or []:
        parts = str(relay).replace("\\r", "").split("\\n")
        for part in parts:
            value = part.strip()
            if not value:
                continue
            if not value.startswith("wss://"):
                continue
            if value in seen:
                continue
            seen.add(value)
            out.append(value)

    return out


def _get_pending_zaps():
    cfg = load_config()
    data = cfg.get("pending_zaps", {}) or {}

    changed = False
    for item in data.values():
        if isinstance(item, dict):
            cleaned = _normalize_relays(item.get("relays", []))
            if cleaned != item.get("relays", []):
                item["relays"] = cleaned
                changed = True

    if changed:
        cfg["pending_zaps"] = data
        save_config(cfg)

    return data
"""

if needle not in text:
    raise SystemExit("Could not find _get_pending_zaps block")

text = text.replace(needle, replacement, 1)
p.write_text(text, encoding="utf-8")
print("Patched relay normalization.")
