# HBeam

## Current State
The messaging system has persistent backend storage (Motoko `persistent actor`) and a polling-based frontend that fetches messages every 3 seconds. The `sendMessage` call was previously fixed to pass the contact address at call time. However, several issues remain:

1. **No optimistic updates** — after sending, the UI waits for the backend round-trip + refetch before showing the message, making it feel broken or slow.
2. **`isLoading` used instead of `isPending`** — in React Query v5, `isLoading` is true even during background refetches, causing the spinner to flash every 3 seconds while a conversation is open.
3. **Messages not sorted by timestamp** — backend returns messages in insertion order, but concurrent sends or clock skew could produce wrong order in the UI.
4. **No auto-scroll** — new incoming or sent messages don't scroll the chat to the bottom.
5. **Fake demo contacts** — when the user has no contacts yet, the UI shows fake placeholder contacts ("Alice H.", "Bob Wilson", "Carol M.") with invalid addresses. Sending to these silently fails or creates orphan conversations.
6. **Input not cleared instantly** — the input field only cleared after `await mutateAsync` resolved, so there was a noticeable delay.
7. **No delivery status indicator** — sent messages had no visual confirmation of delivery.

## Requested Changes (Diff)

### Add
- Optimistic update in `useSendMessage`: instantly append the outgoing message to the local query cache before the backend responds; roll back on error.
- Auto-scroll anchor `<div ref={messagesEndRef} />` at the end of the message list, scrolled into view via `useEffect` whenever `messages` changes.
- `Check` icon (from lucide-react) shown next to the timestamp on the sender's own messages as a delivered indicator.
- `messagesEndRef` declared with `useRef<HTMLDivElement>` in `AppView`.

### Modify
- `useGetMessages`: use `isPending` not `isLoading` for initial-load detection; sort messages ascending by `timestamp` before returning; add `staleTime: 0` and `placeholderData` to keep previous data while switching contacts.
- `useSendMessage`: add `onMutate` (optimistic insert), `onError` (rollback), replace `onSuccess` with `onSettled` (always refetch after network response).
- `AppView.sendMessage()`: clear the input field immediately before `await mutateAsync`, so the UI responds instantly.
- `AppView`: remove fake demo contacts — `displayContacts` is now just `contacts` directly (empty state message already handles the empty list case).
- `AppView`: use `messagesLoading` (now mapped from `isPending`) to only show the spinner on the very first load, not on background refetches.

### Remove
- The `displayContacts` array containing hardcoded fake addresses (`hoosat:qalice`, etc.).
- The `conversationMessages` alias (unused indirection — `messages` used directly via `conversationMessages` which is now just the same reference).

## Implementation Plan
1. Edit `src/frontend/src/hooks/useQueries.ts`:
   - `useGetMessages`: sort result, add `staleTime`, `placeholderData`, rename `isLoading` expose to `isPending`.
   - `useSendMessage`: add `onMutate` optimistic update, `onError` rollback, replace `onSuccess` with `onSettled`.
2. Edit `src/frontend/src/pages/AppView.tsx`:
   - Add `useRef`, `Check` to imports.
   - Change `isLoading: messagesLoading` → `isPending: messagesLoading`.
   - Replace `displayContacts` block with `const displayContacts = contacts`.
   - Add `messagesEndRef` + `useEffect` auto-scroll.
   - Update `sendMessage()` to clear input before await.
   - Add `<div ref={messagesEndRef} />` after last message item.
   - Add `Check` icon to sent message timestamp row.
