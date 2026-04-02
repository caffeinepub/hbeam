import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getMessages(myAddress, contactAddress);
    },
    enabled: !!actor && !isFetching && !!myAddress && !!contactAddress,
    refetchInterval: 3000,
  });
}

export function useSendMessage(myAddress: string, contactAddress: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!actor) throw new Error("Not connected");
      const timestamp = BigInt(Date.now());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).sendMessage(
        myAddress,
        contactAddress,
        content,
        timestamp,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["messages", myAddress, contactAddress],
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
