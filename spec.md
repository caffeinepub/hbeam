# HBeam

## Current State
HBeam is a Hoosat blockchain wallet and messenger app. The app has working backend messaging APIs (sendMessage, getMessages, addContact, etc.) and a full frontend. The core recurring issue is that `hoosat-sdk-web` was never properly installed as a package dependency, causing wallet generation, import, and unlock to throw errors via the stub.

## Requested Changes (Diff)

### Add
- `hoosat-sdk-web@0.1.7` to package.json dependencies (properly installed from npm)

### Modify
- Nothing else — the logic and UI are correct once the SDK is properly available

### Remove
- Nothing

## Implementation Plan
1. Install `hoosat-sdk-web@0.1.7` from npm and persist it in package.json
2. Verify no vite alias overrides it to the stub
3. Run full build validation
