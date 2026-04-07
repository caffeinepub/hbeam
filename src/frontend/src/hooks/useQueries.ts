import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageType } from "../backend";
import type {
  Contact,
  MessagePublic,
  PaymentRecord,
  PaymentStatus,
  PresenceRecord,
} from "../backend.d.ts";
import { useActor } from "./useActor";

// Derive a stable convId from two addresses (sorted so A→B == B→A)
function convId(a: string, b: string): string {
  return [a, b].sort().join(":");
}

// ─── Contacts ──────────────────────────────────────────────────────────────

export function useGetContacts(userAddress: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Contact[]>({
    queryKey: ["contacts", userAddress],
    queryFn: async () => {
      if (!actor || !userAddress) return [];
      return actor.getContacts(userAddress);
    },
    enabled: !!actor && !isFetching && !!userAddress,
    staleTime: 30_000,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useAddContact(userAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contactAddress,
      displayName,
    }: { contactAddress: string; displayName: string }) => {
      if (!actor) throw new Error("Actor not ready — try again");
      if (!userAddress) throw new Error("No wallet address");
      return actor.addContact(userAddress, contactAddress, displayName);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts", userAddress] });
    },
  });
}

export function useRemoveContact(userAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (contactAddress: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeContact(userAddress, contactAddress);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts", userAddress] });
    },
  });
}

// ─── Messages ──────────────────────────────────────────────────────────────

export function useGetMessages(myAddress: string, contactAddress: string) {
  const { actor, isFetching } = useActor();
  return useQuery<MessagePublic[]>({
    queryKey: ["messages", myAddress, contactAddress],
    queryFn: async () => {
      if (!actor || !myAddress || !contactAddress) return [];
      const msgs = await actor.getMessages(
        myAddress,
        contactAddress,
        null,
        null,
      );
      return [...msgs].sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
      );
    },
    enabled: !!actor && !isFetching && !!myAddress && !!contactAddress,
    refetchInterval: 2000,
    staleTime: 0,
    placeholderData: (prev) => prev,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useSendMessage(myAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      contactAddress,
    }: {
      content: string;
      contactAddress: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      if (!myAddress) throw new Error("No wallet address");
      if (!contactAddress) throw new Error("No contact selected");
      const timestamp = BigInt(Date.now());
      const msgId = await actor.sendMessage(
        myAddress,
        contactAddress,
        content,
        timestamp,
        MessageType.text,
        null,
      );
      console.log("[sendMessage] success, id:", msgId);
      return { timestamp, content, contactAddress, msgId };
    },
    onMutate: async ({ content, contactAddress }) => {
      const queryKey = ["messages", myAddress, contactAddress];
      await qc.cancelQueries({ queryKey });
      const previousMessages = qc.getQueryData<MessagePublic[]>(queryKey) ?? [];
      const optimisticMessage: MessagePublic = {
        id: `optimistic-${Date.now()}`,
        sender: myAddress,
        recipient: contactAddress,
        content,
        timestamp: BigInt(Date.now()),
        messageType: "text" as MessagePublic["messageType"],
        reactions: [],
        readBy: [],
      };
      qc.setQueryData<MessagePublic[]>(queryKey, (old) => [
        ...(old ?? []),
        optimisticMessage,
      ]);
      return { previousMessages, queryKey };
    },
    onError: (err, _vars, context) => {
      console.error("[sendMessage] error:", err);
      if (context) {
        qc.setQueryData(context.queryKey, context.previousMessages);
      }
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({
        queryKey: ["messages", myAddress, variables.contactAddress],
      });
    },
  });
}

export function useAddReaction(myAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contactAddress,
      messageId,
      emoji,
    }: { contactAddress: string; messageId: string; emoji: string }) => {
      if (!actor) throw new Error("Not connected");
      const cid = convId(myAddress, contactAddress);
      await actor.addReaction(
        myAddress,
        cid,
        messageId,
        emoji,
        BigInt(Date.now()),
      );
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({
        queryKey: ["messages", myAddress, variables.contactAddress],
      });
    },
  });
}

export function useRemoveReaction(myAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contactAddress,
      messageId,
      emoji,
    }: { contactAddress: string; messageId: string; emoji: string }) => {
      if (!actor) throw new Error("Not connected");
      const cid = convId(myAddress, contactAddress);
      await actor.removeReaction(myAddress, cid, messageId, emoji);
    },
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({
        queryKey: ["messages", myAddress, variables.contactAddress],
      });
    },
  });
}

export function useMarkMessagesRead(myAddress: string) {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      contactAddress,
      upToTimestamp,
    }: { contactAddress: string; upToTimestamp: bigint }) => {
      if (!actor || !myAddress) return;
      const cid = convId(myAddress, contactAddress);
      await actor.markMessagesRead(myAddress, cid, upToTimestamp);
    },
  });
}

export function useUnreadCount(myAddress: string, contactAddress: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["unread", myAddress, contactAddress],
    queryFn: async () => {
      if (!actor || !myAddress || !contactAddress) return BigInt(0);
      return actor.getUnreadCount(myAddress, contactAddress);
    },
    enabled: !!actor && !isFetching && !!myAddress && !!contactAddress,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
  });
}

// ─── Typing Status ─────────────────────────────────────────────────────────

export function useTypingStatus(myAddress: string, contactAddress: string) {
  const { actor, isFetching } = useActor();
  const cid = convId(myAddress, contactAddress);
  return useQuery<string[]>({
    queryKey: ["typing", cid],
    queryFn: async () => {
      if (!actor || !myAddress || !contactAddress) return [];
      return actor.getTypingStatus(cid);
    },
    enabled: !!actor && !isFetching && !!myAddress && !!contactAddress,
    refetchInterval: 1000,
    staleTime: 0,
    retry: 2,
    retryDelay: 500,
  });
}

export function useSetTypingStatus(myAddress: string) {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      contactAddress,
      isTyping,
    }: { contactAddress: string; isTyping: boolean }) => {
      if (!actor || !myAddress) return;
      const cid = convId(myAddress, contactAddress);
      await actor.setTypingStatus(myAddress, cid, isTyping, BigInt(Date.now()));
    },
  });
}

// ─── Presence ──────────────────────────────────────────────────────────────

export function usePresence(myAddress: string, contactAddresses: string[]) {
  const { actor, isFetching } = useActor();
  return useQuery<PresenceRecord[]>({
    queryKey: ["presence", ...contactAddresses],
    queryFn: async () => {
      if (!actor || !myAddress || contactAddresses.length === 0) return [];
      return actor.getPresence(contactAddresses);
    },
    enabled:
      !!actor && !isFetching && !!myAddress && contactAddresses.length > 0,
    refetchInterval: 3000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useSetPresence(myAddress: string) {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!actor || !myAddress) return;
      await actor.setPresence(myAddress, isOnline, BigInt(Date.now()));
    },
  });
}

// ─── Payments ──────────────────────────────────────────────────────────────

export function useCreatePaymentMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      sender,
      recipient,
      amountHtn,
    }: { sender: string; recipient: string; amountHtn: string }) => {
      if (!actor) throw new Error("Not connected");
      const msgId = await actor.createPaymentMessage(
        sender,
        recipient,
        amountHtn,
        BigInt(Date.now()),
      );
      console.log("[createPaymentMessage] id:", msgId);
      return msgId;
    },
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      messageId,
      txId,
      newStatus,
    }: { messageId: string; txId: string; newStatus: PaymentStatus }) => {
      if (!actor) throw new Error("Not connected");
      await actor.updatePaymentStatus(
        messageId,
        txId,
        newStatus,
        BigInt(Date.now()),
      );
    },
  });
}

export function usePaymentStatus(messageId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<[PaymentStatus, string] | null>({
    queryKey: ["payment-status", messageId],
    queryFn: async () => {
      if (!actor || !messageId) return null;
      return actor.getPaymentStatus(messageId);
    },
    enabled: !!actor && !isFetching && !!messageId,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
  });
}

export function usePaymentHistory(userAddress: string) {
  const { actor, isFetching } = useActor();
  return useQuery<PaymentRecord[]>({
    queryKey: ["payment-history", userAddress],
    queryFn: async () => {
      if (!actor || !userAddress) return [];
      return actor.getPaymentHistory(userAddress);
    },
    enabled: !!actor && !isFetching && !!userAddress,
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 1000,
  });
}

// ─── Wallet ─────────────────────────────────────────────────────────────────

export function useRegisterWallet() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (hoosatAddress: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerWalletAddress(hoosatAddress);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

// ─── Hoosat Balance ─────────────────────────────────────────────────────────

export function useHoosatBalance(address: string) {
  return useQuery<number | null>({
    queryKey: ["hoosat-balance", address],
    queryFn: async () => {
      if (!address) return null;
      try {
        const res = await fetch(
          `https://proxy.hoosat.net/api/v1/address/${address}/balance`,
        );
        if (!res.ok) return null;
        const json = await res.json();
        if (json.success && json.data?.balance) {
          return Number(json.data.balance) / 100_000_000;
        }
        return 0;
      } catch (e) {
        console.error("[useHoosatBalance] error:", e);
        return null;
      }
    },
    enabled: !!address,
    refetchInterval: 30_000,
    staleTime: 20_000,
    retry: 3,
    retryDelay: 2000,
  });
}
