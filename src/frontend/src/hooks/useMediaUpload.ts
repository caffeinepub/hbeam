import { StorageClient } from "@caffeineai/object-storage";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback, useRef, useState } from "react";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number; abort: () => void }
  | { status: "success"; url: string }
  | { status: "error"; message: string };

async function getStorageClient(): Promise<StorageClient> {
  const storageGatewayUrl =
    process.env.STORAGE_GATEWAY_URL ?? "https://blob.caffeine.ai";
  const agent = HttpAgent.createSync({ host: undefined });
  // Load env config
  try {
    const res = await fetch("/env.json");
    const cfg = await res.json();
    const canisterId =
      cfg.backend_canister_id !== "undefined"
        ? cfg.backend_canister_id
        : (process.env.CANISTER_ID_BACKEND ?? "aaaaa-aa");
    const projectId =
      cfg.project_id !== "undefined"
        ? cfg.project_id
        : "00000000-0000-0000-0000-000000000000";
    return new StorageClient(
      "default-bucket",
      storageGatewayUrl,
      canisterId,
      projectId,
      agent,
    );
  } catch {
    const canisterId = process.env.CANISTER_ID_BACKEND ?? "aaaaa-aa";
    return new StorageClient(
      "default-bucket",
      storageGatewayUrl,
      canisterId,
      "00000000-0000-0000-0000-000000000000",
      agent,
    );
  }
}

export function useMediaUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const abortedRef = useRef(false);

  const upload = useCallback(async (file: File): Promise<string> => {
    abortedRef.current = false;
    let abortCalled = false;
    const abort = () => {
      abortCalled = true;
      abortedRef.current = true;
      setState({ status: "idle" });
    };

    setState({ status: "uploading", progress: 0, abort });

    try {
      const client = await getStorageClient();

      const bytes = new Uint8Array(await file.arrayBuffer());

      const { hash } = await client.putFile(bytes, (progress) => {
        if (!abortCalled) {
          setState({ status: "uploading", progress, abort });
        }
      });

      if (abortCalled) {
        return "";
      }

      const url = await client.getDirectURL(hash);
      setState({ status: "success", url });
      return url;
    } catch (err) {
      if (abortCalled) return "";
      const message =
        err instanceof Error ? err.message : "Upload failed. Please retry.";
      setState({ status: "error", message });
      throw new Error(message);
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, upload, reset };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("pdf")) return "pdf";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
    return "spreadsheet";
  if (mimeType.includes("word") || mimeType.includes("document"))
    return "document";
  return "file";
}
