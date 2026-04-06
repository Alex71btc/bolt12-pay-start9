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

Open DevTools → Console

---

## ✅ 1. Login & Lockout

Test:
1. Enter wrong password multiple times

Expected:
- Error message
- Lockout after attempts
- Countdown visible
- Login works again after timeout

---

## 🔐 2. CSRF Protection

Test (no CSRF header):

fetch('/api/create-offer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount_sat: 1000 })
}).then(r => r.text()).then(console.log)

Expected:
403 CSRF validation failed

---

## ⚡ 3. Core Payment Flows

Test in UI:
- Create Offer
- Pay Offer
- Pay Address
- Create Invoice

All must work.

---

## 🔒 4. Endpoint Protection

Test each without CSRF → must return 403.

---

## 🔁 5. Rate Limit (Cloudflare)

Spam requests → must return 429.

---

## 🍪 6. Cookie Security

Check cookies:
- pay_session: HttpOnly, Secure, SameSite=Strict
- csrf_token: readable

---

## ✅ Final Checklist

- Login lockout works
- CSRF blocks requests
- UI flows work
- Rate limit works
- Cookies secure

---

🚀 If all checks pass → safe to release
