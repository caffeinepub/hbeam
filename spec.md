# HBeam

## Current State
The backend Motoko actor uses `mo:core/Map` and `mo:core/List` for storing contacts, messages, and wallet addresses. The previous code called `Map.add` and `Map.get` as module-level functions with an explicit `compare` argument — but the build script uses `-E M0237` which promotes the "compare can be inferred" warning to a **compile error**, meaning those calls were rejected at build time. The contacts and messages storage was effectively broken, causing `addContact`, `getContacts`, `sendMessage`, and `getMessages` to silently fail or use stale/empty state.

## Requested Changes (Diff)

### Add
- Nothing new.

### Modify
- `src/backend/main.mo`: Rewrite all Map and List calls to use Motoko dot-notation (`map.get(key)`, `map.add(key, value)`, `list.add(item)`, `list.toArray()`, `list.filter(pred)`) which is what the build flags require. Remove unused `caller` bindings (replace with `caller = _`). Fix `getAllWalletAddresses` to use chained dot-notation on the Iter returned by `walletAddresses.entries()`. Add `persistent` keyword to actor for stable storage across upgrades.

### Remove
- Unused `import Nat`, `import Iter`, `import Order` (not needed after refactor).

## Implementation Plan
1. Fix `main.mo` — done. Compiles cleanly with only a redundant-keyword warning (M0217, not an error).
