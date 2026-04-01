# HBeam

## Current State
New project. Empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Landing page: hero section with mint/dark crypto aesthetic, features section, send payment modal showcase
- Chat interface: contacts list, message thread, compose area
- Wallet panel: connect via Hoosat address, show HTN balance (via Hoosat REST API)
- Send HTN payment flow: modal with recipient address, amount, fee estimation, confirm
- File sharing UI (attachment button, file preview in chat)
- Voice message UI (record button, audio playback in chat)
- Integration with Hoosat REST API (https://proxy.hoosat.net/api/v1) for balance and transaction queries
- Message storage in backend canister
- Contact management in backend canister

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Generate Motoko backend: messages, contacts, wallet addresses storage
2. Build landing page with dark glassmorphism design, mint (#35E08A) accent, network-graph decorations
3. Build chat UI: 3-column layout (contacts, thread, wallet panel)
4. Integrate Hoosat REST API for balance lookups and transaction status
5. Send payment modal with HTN amount input and address
6. File sharing and voice message UI components
