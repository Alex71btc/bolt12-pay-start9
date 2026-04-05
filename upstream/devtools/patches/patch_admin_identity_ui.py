from __future__ import annotations

import shutil
from datetime import datetime
from pathlib import Path

TARGET = Path.home() / 'lndk-pay' / 'app' / 'frontend' / 'admin' / 'index.html'


def backup_file(path: Path) -> Path:
    ts = datetime.now().strftime('%Y%m%d-%H%M%S')
    dst = path.with_suffix(path.suffix + f'.bak-{ts}')
    shutil.copy2(path, dst)
    return dst


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if old not in text:
        raise SystemExit(f'Patch failed: could not find block for {label}')
    return text.replace(old, new, 1)


def main() -> None:
    if not TARGET.exists():
        raise SystemExit(f'Not found: {TARGET}')

    backup = backup_file(TARGET)
    text = TARGET.read_text(encoding='utf-8')

    marker = '''    <details class="section">\n      <summary>Alias / Cloudflare BIP353</summary>\n'''
    insert = '''    <section class="section">\n      <h2>Nostr / Identity</h2>\n\n      <label class="label" for="identityAliasInput">Lightning Address Alias</label>\n      <input id="identityAliasInput" type="text" placeholder="z. B. alex" />\n\n      <label class="label" for="identityPubkeyInput" style="margin-top:14px;">Nostr Pubkey (hex oder npub)</label>\n      <input id="identityPubkeyInput" type="text" placeholder="hex... oder npub1..." />\n\n      <label class="label" for="identityRelaysInput" style="margin-top:14px;">Relays (optional, kommagetrennt)</label>\n      <input id="identityRelaysInput" type="text" placeholder="wss://relay.damus.io,wss://nos.lol" />\n\n      <div class="row">\n        <label style="display:flex;align-items:center;gap:8px;">\n          <input id="identityNip05EnabledInput" type="checkbox" checked />\n          <span>NIP-05 aktiv</span>\n        </label>\n\n        <label style="display:flex;align-items:center;gap:8px;">\n          <input id="identityZapEnabledInput" type="checkbox" checked />\n          <span>Zap / Nostr aktiv</span>\n        </label>\n      </div>\n\n      <div class="row">\n        <button id="loadIdentityBtn" class="secondary" type="button">Identity laden</button>\n        <button id="saveIdentityBtn" type="button">Identity speichern</button>\n      </div>\n\n      <div class="hint">\n        Ordnet einer Lightning Address wie <span class="mono">name@domain</span> einen Nostr Pubkey zu.\n        Diese Zuordnung wird für NIP-05 und LNURL Zaps verwendet.\n      </div>\n\n      <label class="label" for="identityResultOutput" style="margin-top:14px;">Identity Ergebnis</label>\n      <textarea id="identityResultOutput" class="mono copyable" readonly placeholder="Hier erscheint die Identity-Konfiguration..." title="Zum Kopieren antippen"></textarea>\n    </section>\n\n    <details class="section">\n      <summary>Alias / Cloudflare BIP353</summary>\n'''
    text = replace_once(text, marker, insert, 'identity section insertion')

    dom_old = '''    const historyList = document.getElementById('historyList');\n\n    const cfRecordNameInput = document.getElementById('cfRecordNameInput');\n'''
    dom_new = '''    const historyList = document.getElementById('historyList');\n\n    const identityAliasInput = document.getElementById('identityAliasInput');\n    const identityPubkeyInput = document.getElementById('identityPubkeyInput');\n    const identityRelaysInput = document.getElementById('identityRelaysInput');\n    const identityNip05EnabledInput = document.getElementById('identityNip05EnabledInput');\n    const identityZapEnabledInput = document.getElementById('identityZapEnabledInput');\n    const identityResultOutput = document.getElementById('identityResultOutput');\n\n    const cfRecordNameInput = document.getElementById('cfRecordNameInput');\n'''
    text = replace_once(text, dom_old, dom_new, 'identity DOM refs')

    preview_old = '''function renderPayPreview(data) {\n  if (!payLivePreview) return;\n\n  payLivePreview.style.display = 'block';\n\n  const title = data?.title || '';\n  const desc = data?.description || '';\n  payPreviewTitle.textContent = title;\n  payPreviewDesc.textContent = desc;\n\n  const metaParts = [];\n  if (data?.amount_sat) metaParts.push(`${formatSats(data.amount_sat)}`);\n  if (data?.min_sat || data?.max_sat) metaParts.push(`${data.min_sat || 0} - ${data.max_sat || 0} sats`);\n  if (data?.comment_allowed) metaParts.push(`Kommentar bis ${data.comment_allowed} Zeichen`);\n\n  payPreviewMeta.textContent = metaParts.join(' • ');\n\n  if (data?.image_data_url) {\n    payPreviewImage.src = data.image_data_url;\n    payPreviewImage.style.display = 'block';\n  } else {\n    payPreviewImage.src = '';\n    payPreviewImage.style.display = 'none';\n  }\n}\n'''
    preview_new = '''function renderPayPreview(data) {\n  if (!payLivePreview) return;\n\n  payLivePreview.style.display = 'block';\n\n  const title = data?.title || '';\n  const desc = data?.description || '';\n  payPreviewTitle.textContent = title;\n  payPreviewDesc.textContent = desc;\n\n  const metaParts = [];\n  if (data?.kind) {\n    if (data.kind === 'lightning_address') metaParts.push('Lightning Address');\n    if (data.kind === 'lnurl') metaParts.push('LNURL Pay');\n    if (data.kind === 'bolt11') metaParts.push('BOLT11 Invoice');\n    if (data.kind === 'bolt12') metaParts.push('BOLT12 Offer');\n  }\n  if (data?.amount_sat) metaParts.push(`${formatSats(data.amount_sat)}`);\n  if (data?.min_sat || data?.max_sat) metaParts.push(`${data.min_sat || 0} - ${data.max_sat || 0} sats`);\n  if (data?.comment_allowed) metaParts.push(`Kommentar bis ${data.comment_allowed} Zeichen`);\n  if (data?.allows_nostr === true || data?.allowsNostr === true) metaParts.push('Zap möglich');\n  if (data?.nip05_active === true) metaParts.push('NIP-05 aktiv');\n  if (data?.nostr_pubkey) metaParts.push(`Nostr: ${String(data.nostr_pubkey).slice(0, 16)}…`);\n\n  payPreviewMeta.textContent = metaParts.join(' • ');\n\n  if (data?.image_data_url) {\n    payPreviewImage.src = data.image_data_url;\n    payPreviewImage.style.display = 'block';\n  } else {\n    payPreviewImage.src = '';\n    payPreviewImage.style.display = 'none';\n  }\n}\n'''
    text = replace_once(text, preview_old, preview_new, 'renderPayPreview')

    insert_after = '''function errorToMessage(error) {\n  if (!error) return 'Unbekannter Fehler';\n\n  if (typeof error === 'string') return error;\n\n  if (error instanceof Error) return error.message || 'Unbekannter Fehler';\n\n  if (typeof error === 'object') {\n    if (typeof error.detail === 'string') return error.detail;\n    if (typeof error.error === 'string') return error.error;\n    if (typeof error.message === 'string') return error.message;\n\n    try {\n      return JSON.stringify(error);\n    } catch {\n      return String(error);\n    }\n  }\n\n  return String(error);\n}\n'''
    functions = insert_after + '''\nasync function loadIdentityConfig(alias = '') {\n  const resolvedAlias = (alias || identityAliasInput.value || '').trim().toLowerCase();\n\n  if (!resolvedAlias) {\n    setStatus('Bitte zuerst einen Alias eingeben.', 'error');\n    return;\n  }\n\n  try {\n    const response = await fetch(`/api/identity-config?alias=${encodeURIComponent(resolvedAlias)}`, {\n      method: 'GET',\n      credentials: 'same-origin',\n      cache: 'no-store'\n    });\n\n    const data = await readJsonOrThrow(response);\n\n    identityAliasInput.value = data.alias || resolvedAlias;\n    identityPubkeyInput.value = data.nostr_pubkey || '';\n    identityRelaysInput.value = Array.isArray(data.relays) ? data.relays.join(',') : '';\n    identityNip05EnabledInput.checked = data.nip05_enabled !== false;\n    identityZapEnabledInput.checked = data.zap_enabled !== false;\n    identityResultOutput.value = JSON.stringify(data, null, 2);\n\n    setStatus(`Identity geladen: ${resolvedAlias}`);\n  } catch (error) {\n    const message = errorToMessage(error);\n    identityResultOutput.value = String(message);\n    setStatus(`Fehler: ${message}`, 'error', true);\n  }\n}\n\nasync function saveIdentityConfig() {\n  const alias = identityAliasInput.value.trim().toLowerCase();\n  const nostrPubkey = identityPubkeyInput.value.trim();\n  const relays = identityRelaysInput.value\n    .split(',')\n    .map(v => v.trim())\n    .filter(Boolean);\n\n  if (!alias) {\n    setStatus('Bitte einen Lightning Address Alias eingeben.', 'error');\n    return;\n  }\n\n  if (!nostrPubkey) {\n    setStatus('Bitte einen Nostr Pubkey eingeben.', 'error');\n    return;\n  }\n\n  const btn = document.getElementById('saveIdentityBtn');\n  btn.disabled = true;\n  const oldText = btn.textContent;\n  btn.textContent = 'Speichere...';\n\n  try {\n    const response = await fetch('/api/identity-config', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      credentials: 'same-origin',\n      body: JSON.stringify({\n        alias,\n        nostr_pubkey: nostrPubkey,\n        relays,\n        nip05_enabled: !!identityNip05EnabledInput.checked,\n        zap_enabled: !!identityZapEnabledInput.checked\n      })\n    });\n\n    const data = await readJsonOrThrow(response);\n    identityResultOutput.value = JSON.stringify(data, null, 2);\n    setStatus(`Identity gespeichert: ${alias}`);\n  } catch (error) {\n    const message = errorToMessage(error);\n    identityResultOutput.value = String(message);\n    setStatus(`Fehler: ${message}`, 'error', true);\n  } finally {\n    btn.disabled = false;\n    btn.textContent = oldText;\n  }\n}\n'''
    if insert_after not in text:
        raise SystemExit('Patch failed: errorToMessage block not found')
    text = text.replace(insert_after, functions, 1)

    listeners_old = '''document.getElementById('logoutBtn')?.addEventListener('click', async () => {\n  try {\n    await fetch('/api/auth/logout', {\n      method: 'POST',\n      credentials: 'same-origin',\n      cache: 'no-store'\n    });\n  } catch {}\n  window.location.href = '/pay-login';\n});\n'''
    listeners_new = '''document.getElementById('loadIdentityBtn')?.addEventListener('click', async () => {\n  await loadIdentityConfig();\n});\n\ndocument.getElementById('saveIdentityBtn')?.addEventListener('click', async () => {\n  await saveIdentityConfig();\n});\n\nidentityResultOutput?.addEventListener('click', async () => {\n  await copyText(identityResultOutput.value, 'Identity-Ergebnis kopiert.');\n});\n\ndocument.getElementById('logoutBtn')?.addEventListener('click', async () => {\n  try {\n    await fetch('/api/auth/logout', {\n      method: 'POST',\n      credentials: 'same-origin',\n      cache: 'no-store'\n    });\n  } catch {}\n  window.location.href = '/pay-login';\n});\n'''
    text = replace_once(text, listeners_old, listeners_new, 'identity listeners')

    TARGET.write_text(text, encoding='utf-8')
    print(f'Patched: {TARGET}')
    print(f'Backup : {backup}')


if __name__ == '__main__':
    main()
