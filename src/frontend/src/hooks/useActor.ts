import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { backendInterface } from "../backend";
import { createActorWithConfig } from "../config";
import { useInternetIdentity } from "./useInternetIdentity";

const ACTOR_QUERY_KEY = "actor";

// Pre-warm the anonymous actor at module load time so the first render
// doesn't have to wait for env.json + actor creation.
let warmActor: backendInterface | null = null;
createActorWithConfig()
  .then((a) => {
    warmActor = a;
  })
  .catch(() => {});

export function useActor() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const prevActorRef = useRef<backendInterface | null>(null);

  const actorQuery = useQuery<backendInterface>({
    queryKey: [ACTOR_QUERY_KEY, identity?.getPrincipal().toString() ?? "anon"],
    queryFn: async () => {
      if (!identity) {
        // Reuse warm actor if available
        if (warmActor) return warmActor;
        return await createActorWithConfig();
      }
      const actor = await createActorWithConfig({
        agentOptions: { identity },
      });
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    // Provide warm actor as initial data to avoid loading flash
    initialData: identity ? undefined : (warmActor ?? undefined),
  });

  // Only invalidate dependent queries when the actor *instance* changes
  useEffect(() => {
    if (actorQuery.data && actorQuery.data !== prevActorRef.current) {
      prevActorRef.current = actorQuery.data;
      queryClient.invalidateQueries({
        predicate: (query) => !query.queryKey.includes(ACTOR_QUERY_KEY),
      });
    }
  }, [actorQuery.data, queryClient]);

  return {
    actor: actorQuery.data ?? null,
    isFetching: actorQuery.isFetching,
  };
}
