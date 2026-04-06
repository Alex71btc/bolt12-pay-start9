# 🔒 Security Smoke Tests (Post-Release)

Quick manual verification after deploying a new release (Start9 / Umbrel / Docker).

---

## 🧪 Goal

Ensure that:

- Auth hardening works
- CSRF protection is active
- Critical endpoints are protected
- Core payment flows still work

---

## 🌐 Setup

Open your app in browser:

- Login page: `/pay-login`
- Admin UI: `/pay`

Open DevTools → **Console**

---

## ✅ 1. Login & Lockout

### Test:

1. Enter wrong password multiple times
2. Observe behavior

### Expected:

- ❌ Error message on wrong password
- 🔒 Lockout after X attempts
- ⏳ Countdown (`retry_after`) visible
- ✅ Login works again after timeout

---

## 🔐 2. CSRF Protection (Critical)

### Test (no CSRF header):

```javascript
fetch('/api/create-offer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount_sat: 1000 })
}).then(r => r.text()).then(console.log)
````

### Expected:

```
403 CSRF validation failed
```

---

## ⚡ 3. Core Payment Flows (UI)

Test in UI:

* ✅ Create Offer
* ✅ Pay Offer
* ✅ Pay Address (LNURL / BIP353)
* ✅ Create BOLT11 Invoice

All must work normally.

---

## 🔒 4. Endpoint Protection Tests

### 4.1 `/api/pay-offer`

```javascript
fetch('/api/pay-offer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    offer: 'lno1...',
    amount_sat: 1000
  })
}).then(r => r.text()).then(console.log)
```

✅ Expected:

```
403 CSRF validation failed
```

---

### 4.2 `/api/pay-address`

```javascript
fetch('/api/pay-address', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    target: 'user@domain.com',
    amount_sat: 1000
  })
}).then(r => r.text()).then(console.log)
```

✅ Expected:

```
403 CSRF validation failed
```

---

### 4.3 `/api/create-invoice`

```javascript
fetch('/api/create-invoice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount_sat: 1000,
    memo: 'test',
    expiry: 3600
  })
}).then(r => r.text()).then(console.log)
```

✅ Expected:

```
403 CSRF validation failed
```

---

### 4.4 `/api/cloudflare/create-bip353`

```javascript
fetch('/api/cloudflare/create-bip353', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    record_name: 'test',
    offer: 'lno1...'
  })
}).then(r => r.text()).then(console.log)
```

✅ Expected:

```
403 CSRF validation failed
```

---

## 🔁 5. Rate Limit (Cloudflare)

### Test:

```javascript
for (let i = 0; i < 10; i++) {
  fetch('/api/cloudflare/create-bip353', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.cookie
        .split('; ')
        .find(c => c.startsWith('csrf_token='))
        ?.split('=')[1]
    },
    body: JSON.stringify({
      record_name: 'test' + i,
      offer: 'lno1...'
    })
  }).then(r => r.text()).then(console.log)
}
```

### Expected:

* First few → OK
* Then:

```
429 Rate limit exceeded
```

---

## 🍪 6. Cookie Security

Check in DevTools → Storage → Cookies:

### Expected:

* `pay_session`

  * HttpOnly ✅
  * Secure ✅
  * SameSite=Strict ✅

* `csrf_token`

  * readable by JS (not HttpOnly) ✅

---

## ✅ Final Checklist

| Check                         | Status |
| ----------------------------- | ------ |
| Login lockout works           | ☐      |
| Retry countdown works         | ☐      |
| CSRF blocks naked requests    | ☐      |
| UI flows work                 | ☐      |
| Cloudflare endpoint protected | ☐      |
| Rate limit triggers           | ☐      |
| Cookies secure                | ☐      |

---

## 🧠 Notes

* Always test **after GitHub build**, not only locally
* Prefer testing on:

  * real domain
  * or onion address
* Repeat before major releases

---

🚀 If all checks pass → safe to announce release

---

