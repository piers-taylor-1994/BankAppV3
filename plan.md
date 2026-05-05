# BankAppV3 — PWA Conversion Plan

## Overview

Convert BankAppV2 (SwiftUI native iOS app) into a Progressive Web App hosted on GitHub Pages. The app is a personal card vault for storing bank card details (bank name, card type, CVV, PIN) behind biometric authentication.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **SvelteKit** (static adapter) | Compiles to minimal vanilla JS, no virtual DOM, best performance for small apps |
| Styling | **CSS** (custom, iOS-inspired) | Native-feeling transitions, safe-area insets, dark mode |
| Auth | **WebAuthn / Passkeys** | Face ID / Touch ID via Safari passkey support |
| Encryption | **Web Crypto API** (AES-GCM 256-bit) | Encrypt card data at rest |
| Storage | **IndexedDB** (via idb-keyval or raw) | Persist encrypted card blob |
| Offline | **Service Worker** (Workbox or custom) | Full offline support, cache-first |
| Hosting | **GitHub Pages** | Free, push-to-deploy via GitHub Actions |
| Package manager | **pnpm** | Fast, disk-efficient |

## Data Model

```typescript
interface Card {
  id: string;          // crypto.randomUUID()
  bank: string;        // Free text, e.g. "HSBC"
  cardType: 'debit' | 'credit';
  cvv: string;         // 3-4 digits
  pin: string;         // 4 digits
}
```

Storage: `Card[]` → JSON → AES-GCM encrypt → single IndexedDB entry.

## Security Architecture

### Authentication Flow

1. App opens → check if passkey is registered
2. **First use**: Prompt to create a passkey (registers Face ID credential)
3. **Subsequent opens**: `navigator.credentials.get()` → Face ID prompt
4. On success → decrypt card data with stored AES key
5. On `visibilitychange` (hidden) → lock app, clear decrypted data from memory
6. On return → require re-authentication

### Encryption

- First setup: generate random 256-bit AES-GCM key via `crypto.subtle.generateKey()`
- Store wrapped key in IndexedDB, gated behind passkey auth flow
- Card data encrypted with random IV per save
- Decrypted data held only in Svelte store (memory), wiped on lock

### Fallback

- If WebAuthn unavailable: fall back to user-set PIN (PBKDF2 → AES key derivation)
- Show warning that biometric auth is not available

## UI Structure

```
App Shell
├── Auth Gate (lock screen / Face ID prompt)
├── Tab Bar (bottom, 3 tabs)
│   ├── Cards Tab — list with empty state, tap → detail, swipe-to-delete
│   ├── Add Card Tab — shared form component
│   └── Settings Tab — version, theme toggle, delete all
```

### Screens (matching current app exactly)

- **Lock Screen**: Lock icon, "Unlock with Face ID" button
- **Cards Tab**: List of CardRow (logo + bank name + card type), empty state
- **Card Detail**: Read-only view, Edit button → modal form, Delete button
- **Add/Edit Form**: Bank (text), Card Type (segmented), CVV (numeric), PIN (numeric), inline validation
- **Settings**: Version, Appearance picker (System/Light/Dark), Delete All Data

### Bank Logos

Ship as static assets: `amex`, `barclays`, `firstdirect`, `hsbc`, `lloyds`, `natwest`, `virgin`, `bank` (fallback). Resolution: lowercase + strip spaces.

## iOS-Native Feel

- Bottom tab bar with `env(safe-area-inset-bottom)` padding
- CSS slide transitions on navigation
- `-apple-system` font stack, 17px body
- System colors for automatic light/dark
- iOS-style segmented controls
- `"display": "standalone"` in manifest (removes Safari UI)
- Apple touch icon + splash screen meta tags

## Project Structure

```
BankAppV3/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte        (Auth gate, tab bar, theme)
│   │   ├── +page.svelte          (Cards list)
│   │   ├── card/[id]/+page.svelte (Card detail)
│   │   ├── add/+page.svelte      (Add card)
│   │   └── settings/+page.svelte
│   ├── lib/
│   │   ├── components/           (TabBar, CardRow, CardForm, LockScreen, SegmentedPicker, ConfirmDialog)
│   │   ├── stores/               (cards.ts, auth.ts, theme.ts)
│   │   ├── services/             (crypto.ts, webauthn.ts, storage.ts, bankLogo.ts)
│   │   └── validators/card.ts
│   ├── app.html
│   └── app.css
├── static/
│   ├── logos/                    (Bank logo PNGs)
│   ├── icons/                    (PWA icons)
│   └── manifest.json
├── svelte.config.js              (adapter-static)
├── package.json
└── plan.md
```

## Deployment

1. Private GitHub repo
2. GitHub Actions: `pnpm install` → `pnpm build` → deploy to Pages
3. Access: `https://<username>.github.io/BankAppV3/`
4. Install: Safari → Share → "Add to Home Screen"

## Implementation Order

1. Scaffold SvelteKit (adapter-static, TypeScript)
2. App shell — tab bar, routing, layout, iOS-style CSS
3. Cards CRUD — stores, form, validation, list, detail (plain localStorage first)
4. WebAuthn — passkey registration/auth, lock screen, auto-lock on background
5. Encryption — Web Crypto key gen, encrypt/decrypt, migrate to IndexedDB
6. Theming — light/dark/system toggle
7. Service worker — offline caching
8. PWA manifest + icons
9. Bank logos — extract from BankAppV2 asset catalog
10. GitHub Actions — CI/CD to Pages
11. Polish — transitions, animations, device testing

## Key Differences from Native

| Feature | Native | PWA |
|---------|--------|-----|
| Auth | LAContext (Face ID) | WebAuthn passkey (Face ID via Safari) |
| Storage | iOS Keychain | IndexedDB + AES-GCM |
| Signing | Provisioning profile (expires!) | None (never expires) |
| Install | Xcode → device | Safari → Add to Home Screen |
| Updates | Rebuild + reinstall | Push to GitHub, auto-updates |
| Haptics | Native | Not available |
| Launch | Instant | ~0.5s cold start |

## Notes for Implementing Agent

- Copy bank logo assets from `~/Projects/Personal/BankAppV2/BankApp/Assets.xcassets/` (extract from `.imageset` folders)
- Match existing validation exactly (see `CardFormValidator` in `CardEditView.swift`)
- No sorting/search/categories — keep it simple
- Test WebAuthn in Safari on iOS 16.4+
- For local dev: `pnpm dev` → test in Safari (not Chrome for WebAuthn parity)
