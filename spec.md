# HBeam

## Current State
The app has a `ConnectScreen` that accepts a Hoosat address (read-only), and a `SendHTNModal` that simulates sending (setTimeout mock, no real transaction). Balance is fetched from the Hoosat REST API. No private key management exists.

## Requested Changes (Diff)

### Add
- Install `hoosat-sdk-web` npm package
- `WalletSetup` flow on the connect screen: generate a new wallet OR import via private key hex
- Encrypted private key storage in localStorage using Web Crypto API (AES-GCM, PBKDF2, password-locked)
- Real transaction signing in `SendHTNModal` using `HoosatTxBuilder` + `HoosatCrypto` + `HoosatWebClient`
  - Fetch UTXOs from `client.getUtxos([myAddress])`
  - Fetch fee estimate from `client.getFeeEstimate()`
  - Build tx with `HoosatTxBuilder`, sign with private key, submit via `client.submitTransaction()`
  - Show real TX ID on success (with link or copy button)
- A "Lock wallet" button that clears the in-memory private key (address remains to re-unlock)
- Password prompt dialog to decrypt and unlock wallet when needed

### Modify
- `ConnectScreen`: replace simple address input with wallet setup (generate / import / unlock existing)
- `SendHTNModal`: replace mock `setTimeout` with real SDK transaction signing flow
- `AppView`: pass `privateKey` (in-memory, never persisted in plaintext) alongside `myAddress`

### Remove
- Mock `await new Promise((r) => setTimeout(r, 1500))` in `SendHTNModal`

## Implementation Plan
1. Install `hoosat-sdk-web` in `package.json`
2. Create `src/hooks/useWallet.ts` - wallet state hook (address, unlock/lock, encrypted storage, generate/import)
3. Update `ConnectScreen` to offer three paths: Generate New Wallet, Import Private Key, Unlock Existing (if encrypted key in localStorage)
4. Update `SendHTNModal` to accept `privateKey: Buffer` prop and perform real tx signing
5. Thread `privateKey` through `AppView` and `AppRoot`
