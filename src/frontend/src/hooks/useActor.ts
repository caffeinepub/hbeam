import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend.d.ts";

/**
 * Local useActor hook that wraps the core-infrastructure useActor
 * with our specific backend createActor function.
 * Returns { actor: backendInterface | null, isFetching: boolean }
 */
export function useActor(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  return useCoreActor(createActor);
}
