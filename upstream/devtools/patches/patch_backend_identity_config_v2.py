from pathlib import Path
from datetime import datetime

APP = Path('backend/app.py')
if not APP.exists():
    raise SystemExit('Run this from ~/lndk-pay/app')

text = APP.read_text(encoding='utf-8')
orig = text

def replace_once(old: str, new: str, label: str):
    global text
    if old not in text:
        raise SystemExit(f'Patch failed: could not find block for {label}')
    text = text.replace(old, new, 1)

# 1) insert config helpers after NOSTR_NAME_MAP
anchor = 'NOSTR_NAME_MAP = _load_nostr_name_map()\n'
if '_get_identity_entry(' not in text:
    insert = '''NOSTR_NAME_MAP = _load_nostr_name_map()\n\n\ndef _get_identity_map() -> dict[str, dict[str, Any]]:\n    cfg = load_config()\n    data = cfg.get("nostr_identities", {}) or {}\n    return data if isinstance(data, dict) else {}\n\n\ndef _save_identity_map(items: dict[str, dict[str, Any]]) -> None:\n    cfg = load_config()\n    cfg["nostr_identities"] = items\n    save_config(cfg)\n\n\ndef _get_identity_entry(alias: str) -> dict[str, Any]:\n    key = (alias or "").strip().lower()\n    if not key:\n        return {}\n    data = _get_identity_map()\n    item = data.get(key) or {}\n    return item if isinstance(item, dict) else {}\n\n\ndef _normalize_nostr_pubkey(value: str) -> str:\n    raw = (value or "").strip()\n    if not raw:\n        return ""\n    lowered = raw.lower()\n    if re.fullmatch(r"[0-9a-f]{64}", lowered):\n        return lowered\n    decoded = _npub_to_hex_pubkey(raw)\n    if decoded and re.fullmatch(r"[0-9a-f]{64}", decoded):\n        return decoded.lower()\n    raise ValueError("Invalid nostr pubkey. Expected hex or npub.")\n\n\ndef _get_identity_relays(alias: str) -> list[str]:\n    entry = _get_identity_entry(alias)\n    relays = entry.get("relays") or []\n    return [str(x).strip() for x in relays if str(x).strip()]\n\n\ndef _is_nip05_enabled(alias: str) -> bool:\n    entry = _get_identity_entry(alias)\n    if entry:\n        return bool(entry.get("nip05_enabled", True))\n    return bool(_get_nostr_pubkey_hex_for_name(alias))\n\n\ndef _is_zap_enabled(alias: str) -> bool:\n    entry = _get_identity_entry(alias)\n    if entry:\n        return bool(entry.get("zap_enabled", True)) and bool(_get_nostr_pubkey_hex_for_name(alias))\n    return bool(_get_nostr_pubkey_hex_for_name(alias))\n\n'''
    replace_once(anchor, insert, 'NOSTR_NAME_MAP anchor')

# 2) replace old nostr helper functions
old_helpers = '''def _get_nostr_pubkey_for_name(name: str) -> str:\n    if not name:\n        return ""\n    return NOSTR_NAME_MAP.get(name.strip().lower(), "")\n\n\n\ndef _npub_to_hex_pubkey(npub: str) -> str:\n'''
new_helpers = '''def _get_nostr_pubkey_for_name(name: str) -> str:\n    if not name:\n        return ""\n\n    key = name.strip().lower()\n    entry = _get_identity_entry(key)\n    if entry:\n        hex_value = str(entry.get("nostr_pubkey", "")).strip().lower()\n        if hex_value:\n            return hex_value\n\n    env_value = NOSTR_NAME_MAP.get(key, "")\n    if not env_value:\n        return ""\n\n    if re.fullmatch(r"[0-9a-fA-F]{64}", env_value):\n        return env_value.lower()\n\n    return env_value\n\n\n\ndef _npub_to_hex_pubkey(npub: str) -> str:\n'''
replace_once(old_helpers, new_helpers, 'nostr helper header')

old_helper2 = '''def _get_nostr_pubkey_for_name(name: str) -> str:\n    if not name:\n        return ""\n    return NOSTR_NAME_MAP.get(name.strip().lower(), "")\n\n\ndef _get_nostr_pubkey_hex_for_name(name: str) -> str:\n    return _npub_to_hex_pubkey(_get_nostr_pubkey_for_name(name))\n'''
new_helper2 = '''def _get_nostr_pubkey_hex_for_name(name: str) -> str:\n    value = _get_nostr_pubkey_for_name(name)\n    if not value:\n        return ""\n    if re.fullmatch(r"[0-9a-fA-F]{64}", value):\n        return value.lower()\n    return _npub_to_hex_pubkey(value)\n'''
replace_once(old_helper2, new_helper2, 'nostr helper lookup')

# 3) add pydantic model
model_anchor = '''class PreviewPayTargetRequest(BaseModel):\n    target: str = Field(min_length=3, description="Lightning Address or lnurl1...")\n\nclass PayLnurlRequest(BaseModel):\n'''
model_insert = '''class PreviewPayTargetRequest(BaseModel):\n    target: str = Field(min_length=3, description="Lightning Address or lnurl1...")\n\n\nclass IdentityConfigPayload(BaseModel):\n    alias: str = Field(min_length=1)\n    nostr_pubkey: str = Field(min_length=1)\n    relays: list[str] = Field(default_factory=list)\n    nip05_enabled: bool = True\n    zap_enabled: bool = True\n\n\nclass PayLnurlRequest(BaseModel):\n'''
replace_once(model_anchor, model_insert, 'IdentityConfigPayload model')

# 4) patch lnurl metadata route
old_meta = '''    return LnurlPayMetadataResponse(\n        callback=_lnurl_callback_url(alias["username"]),\n        minSendable=min_sendable,\n        maxSendable=max_sendable,\n        metadata=_lnurl_metadata_json(alias["identifier"], alias["description"]),\n        commentAllowed=max(0, LNURL_COMMENT_ALLOWED),\n        allowsNostr=True,\n        nostrPubkey=_get_nostr_pubkey_hex_for_name(alias["username"]),\n    )\n'''
new_meta = '''    recipient_nostr_hex = _get_nostr_pubkey_hex_for_name(alias["username"])\n    zap_enabled = _is_zap_enabled(alias["username"])\n\n    return LnurlPayMetadataResponse(\n        callback=_lnurl_callback_url(alias["username"]),\n        minSendable=min_sendable,\n        maxSendable=max_sendable,\n        metadata=_lnurl_metadata_json(alias["identifier"], alias["description"]),\n        commentAllowed=max(0, LNURL_COMMENT_ALLOWED),\n        allowsNostr=bool(zap_enabled and recipient_nostr_hex),\n        nostrPubkey=recipient_nostr_hex if zap_enabled else "",\n    )\n'''
replace_once(old_meta, new_meta, 'lnurl metadata return')

# 5) patch callback route
replace_once(
    '    recipient_nostr_hex = _get_nostr_pubkey_hex_for_name(username)\n\n    if nostr:\n',
    '    recipient_nostr_hex = _get_nostr_pubkey_hex_for_name(username)\n    zap_enabled = _is_zap_enabled(username)\n\n    if nostr and not (zap_enabled and recipient_nostr_hex):\n        raise HTTPException(status_code=400, detail="zaps are not enabled for this address")\n\n    if nostr:\n',
    'lnurl callback zap guard'
)
replace_once(
    '''        "disposable": False,\n        "allowsNostr": True,\n        "nostrPubkey": _get_nostr_pubkey_hex_for_name(username),\n    }\n''',
    '''        "disposable": False,\n        "allowsNostr": bool(zap_enabled and recipient_nostr_hex),\n        "nostrPubkey": recipient_nostr_hex if zap_enabled else "",\n    }\n''',
    'lnurl callback response'
)

# 6) patch preview route address and lnurl returns
old_preview_addr = '''        return {\n            "kind": "lightning_address",\n            "title": "Lightning Address",\n            "identifier": target,\n            "description": meta_info["text_plain"] or meta.get("description", ""),\n            "image_data_url": meta_info["image_data_url"],\n            "comment_allowed": int(meta.get("commentAllowed") or 0),\n            "min_sat": int(meta.get("minSendable") or 0) // 1000,\n            "max_sat": int(meta.get("maxSendable") or 0) // 1000,\n            "raw": meta,\n        }\n'''
new_preview_addr = '''        username = target.split("@", 1)[0].strip().lower()\n        recipient_nostr_hex = _get_nostr_pubkey_hex_for_name(username)\n\n        return {\n            "kind": "lightning_address",\n            "title": "Lightning Address",\n            "identifier": target,\n            "description": meta_info["text_plain"] or meta.get("description", ""),\n            "image_data_url": meta_info["image_data_url"],\n            "comment_allowed": int(meta.get("commentAllowed") or 0),\n            "min_sat": int(meta.get("minSendable") or 0) // 1000,\n            "max_sat": int(meta.get("maxSendable") or 0) // 1000,\n            "allows_nostr": bool(meta.get("allowsNostr") or (_is_zap_enabled(username) and recipient_nostr_hex)),\n            "nip05_active": bool(_is_nip05_enabled(username) and recipient_nostr_hex),\n            "nostr_pubkey": recipient_nostr_hex,\n            "raw": meta,\n        }\n'''
replace_once(old_preview_addr, new_preview_addr, 'preview lightning address')

old_preview_lnurl = '''        return {\n            "kind": "lnurl",\n            "title": "LNURL Pay",\n            "identifier": target,\n            "description": meta_info["text_plain"] or meta.get("description", ""),\n            "image_data_url": meta_info["image_data_url"],\n            "comment_allowed": int(meta.get("commentAllowed") or 0),\n            "min_sat": int(meta.get("minSendable") or 0) // 1000,\n            "max_sat": int(meta.get("maxSendable") or 0) // 1000,\n            "raw": meta,\n        }\n'''
new_preview_lnurl = '''        return {\n            "kind": "lnurl",\n            "title": "LNURL Pay",\n            "identifier": target,\n            "description": meta_info["text_plain"] or meta.get("description", ""),\n            "image_data_url": meta_info["image_data_url"],\n            "comment_allowed": int(meta.get("commentAllowed") or 0),\n            "min_sat": int(meta.get("minSendable") or 0) // 1000,\n            "max_sat": int(meta.get("maxSendable") or 0) // 1000,\n            "allows_nostr": bool(meta.get("allowsNostr")),\n            "nip05_active": False,\n            "nostr_pubkey": str(meta.get("nostrPubkey") or ""),\n            "raw": meta,\n        }\n'''
replace_once(old_preview_lnurl, new_preview_lnurl, 'preview lnurl')

# 7) insert identity API routes before pay-lnurl route
api_anchor = '''    return {\n        "kind": "unknown",\n        "title": "",\n        "description": "",\n        "image_data_url": "",\n        "comment_allowed": 0,\n        "min_sat": "",\n        "max_sat": "",\n    }\n\n@app.post("/api/pay-lnurl", response_model=PayOfferResponse)\n'''
api_insert = '''    return {\n        "kind": "unknown",\n        "title": "",\n        "description": "",\n        "image_data_url": "",\n        "comment_allowed": 0,\n        "min_sat": "",\n        "max_sat": "",\n    }\n\n\n@app.get("/api/identity-config")\ndef get_identity_config(alias: str):\n    key = (alias or "").strip().lower()\n    if not key:\n        raise HTTPException(status_code=400, detail="alias is required")\n\n    entry = _get_identity_entry(key)\n    pubkey_hex = _get_nostr_pubkey_hex_for_name(key)\n\n    if not entry and not pubkey_hex:\n        return {\n            "alias": key,\n            "nostr_pubkey": "",\n            "relays": [],\n            "nip05_enabled": True,\n            "zap_enabled": True,\n            "exists": False,\n        }\n\n    return {\n        "alias": key,\n        "nostr_pubkey": pubkey_hex,\n        "relays": _get_identity_relays(key),\n        "nip05_enabled": bool(entry.get("nip05_enabled", True)) if entry else True,\n        "zap_enabled": bool(entry.get("zap_enabled", True)) if entry else bool(pubkey_hex),\n        "exists": bool(entry),\n    }\n\n\n@app.post("/api/identity-config")\ndef save_identity_config(payload: IdentityConfigPayload):\n    alias = payload.alias.strip().lower()\n    if not alias:\n        raise HTTPException(status_code=400, detail="alias is required")\n\n    try:\n        normalized_pubkey = _normalize_nostr_pubkey(payload.nostr_pubkey)\n    except ValueError as exc:\n        raise HTTPException(status_code=400, detail=str(exc)) from exc\n\n    relays = [str(item).strip() for item in (payload.relays or []) if str(item).strip()]\n\n    items = _get_identity_map()\n    items[alias] = {\n        "nostr_pubkey": normalized_pubkey,\n        "relays": relays,\n        "nip05_enabled": bool(payload.nip05_enabled),\n        "zap_enabled": bool(payload.zap_enabled),\n    }\n    _save_identity_map(items)\n\n    return {\n        "alias": alias,\n        "nostr_pubkey": normalized_pubkey,\n        "relays": relays,\n        "nip05_enabled": bool(payload.nip05_enabled),\n        "zap_enabled": bool(payload.zap_enabled),\n        "saved": True,\n    }\n\n@app.post("/api/pay-lnurl", response_model=PayOfferResponse)\n'''
replace_once(api_anchor, api_insert, 'identity API route insertion')

# 8) replace nostr.json route
old_nostr_route = '''@app.get("/.well-known/nostr.json")\nasync def nostr_well_known(name: str = Query(default=None)):\n    if name:\n        key = name.strip().lower()\n        pubkey = NOSTR_NAME_MAP.get(key)\n        if not pubkey:\n            return JSONResponse({"names": {}}, status_code=200)\n\n        pubkey_hex = _npub_to_hex_pubkey(pubkey)\n        if not pubkey_hex:\n            return JSONResponse({"names": {}}, status_code=200)\n\n        return {"names": {key: pubkey_hex}}\n\n    result = {}\n    for key, pubkey in NOSTR_NAME_MAP.items():\n        pubkey_hex = _npub_to_hex_pubkey(pubkey)\n        if pubkey_hex:\n            result[key] = pubkey_hex\n\n    return {"names": result}\n'''
new_nostr_route = '''@app.get("/.well-known/nostr.json")\nasync def nostr_well_known(name: str = Query(default=None)):\n    names: dict[str, str] = {}\n    relays: dict[str, list[str]] = {}\n\n    for key, entry in sorted(_get_identity_map().items()):\n        if not isinstance(entry, dict):\n            continue\n        if not bool(entry.get("nip05_enabled", True)):\n            continue\n        pubkey_hex = _get_nostr_pubkey_hex_for_name(key)\n        if not pubkey_hex:\n            continue\n        names[key] = pubkey_hex\n        relay_list = _get_identity_relays(key)\n        if relay_list:\n            relays[pubkey_hex] = relay_list\n\n    for key, pubkey in NOSTR_NAME_MAP.items():\n        key = key.strip().lower()\n        if key in names:\n            continue\n        pubkey_hex = _npub_to_hex_pubkey(pubkey)\n        if pubkey_hex:\n            names[key] = pubkey_hex\n\n    if name:\n        key = name.strip().lower()\n        if key not in names:\n            return JSONResponse({"names": {}}, status_code=200)\n        result = {"names": {key: names[key]}}\n        if names[key] in relays:\n            result["relays"] = {names[key]: relays[names[key]]}\n        return result\n\n    result = {"names": names}\n    if relays:\n        result["relays"] = relays\n    return result\n'''
replace_once(old_nostr_route, new_nostr_route, 'nostr well-known route')

# write backup and file
stamp = datetime.now().strftime('%Y%m%d-%H%M%S')
backup = APP.with_name(f'app.py.pre-identity-v2-{stamp}.bak')
backup.write_text(orig, encoding='utf-8')
APP.write_text(text, encoding='utf-8')
print(f'Patched: {APP}')
print(f'Backup : {backup}')
