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
