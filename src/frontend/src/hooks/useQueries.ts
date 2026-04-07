import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetContacts(userAddress: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contacts", userAddress],
    queryFn: async () => {
      if (!actor || !userAddress) return [];
      return actor.getContacts(userAddress);
    },
    enabled: !!actor && !isFetching && !!userAddress,
  });
}

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

export function useAddContact(userAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      contactAddress,
      displayName,
    }: { contactAddress: string; displayName: string }) => {
      if (!actor) throw new Error("Not connected");
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

export function useGetMessages(myAddress: string, contactAddress: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["messages", myAddress, contactAddress],
    queryFn: async () => {
      if (!actor || !myAddress || !contactAddress) return [];
      const msgs = await actor.getMessages(myAddress, contactAddress);
      // Sort ascending by timestamp so messages always appear in order
      return [...msgs].sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : a.timestamp > b.timestamp ? 1 : 0,
      );
    },
    enabled: !!actor && !isFetching && !!myAddress && !!contactAddress,
    // Poll every 3s for near-realtime sync; staleTime 0 ensures fresh data
    refetchInterval: 3000,
    staleTime: 0,
    // Keep previous data so switching contacts doesn't flash empty
    placeholderData: (prev) => prev,
  });
}

// Addresses are passed at call time so the mutation always uses the current contact
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
      await actor.sendMessage(myAddress, contactAddress, content, timestamp);
      return { timestamp, content, contactAddress };
    },
    // Optimistic update: add the message locally before the backend responds
    onMutate: async ({ content, contactAddress }) => {
      const queryKey = ["messages", myAddress, contactAddress];
      // Cancel any in-flight refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey });
      const previousMessages = qc.getQueryData<Message[]>(queryKey) ?? [];
      const optimisticMessage: Message = {
        sender: myAddress,
        recipient: contactAddress,
        content,
        timestamp: BigInt(Date.now()),
        messageType: { text: null },
        fileMetadata: [],
      };
      qc.setQueryData<Message[]>(queryKey, (old) => [
        ...(old ?? []),
        optimisticMessage,
      ]);
      return { previousMessages, queryKey };
    },
    // On error, roll back to previous messages
    onError: (_err, _vars, context) => {
      if (context) {
        qc.setQueryData(context.queryKey, context.previousMessages);
      }
    },
    // After success or error, always refetch to sync with server
    onSettled: (_data, _err, variables) => {
      qc.invalidateQueries({
        queryKey: ["messages", myAddress, variables.contactAddress],
      });
    },
  });
}

export function useHoosatBalance(address: string) {
  return useQuery({
    queryKey: ["hoosat-balance", address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(
        `https://proxy.hoosat.net/api/v1/address/${address}/balance`,
      );
      if (!res.ok) return null;
      const json = await res.json();
      if (json.success && json.data?.balance) {
        return Number(json.data.balance) / 100000000;
      }
      return 0;
    },
    enabled: !!address,
    refetchInterval: 30000,
  });
}
