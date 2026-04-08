import { AlertCircle, RefreshCw, X } from "lucide-react";
import type { UploadState } from "../hooks/useMediaUpload";

interface UploadProgressProps {
  state: UploadState;
  fileName?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function UploadProgress({
  state,
  fileName,
  onRetry,
  onCancel,
}: UploadProgressProps) {
  if (state.status === "idle" || state.status === "success") return null;

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{
        background: "oklch(0.18 0.013 240)",
        border: "1px solid oklch(0.25 0.016 240)",
      }}
    >
      {state.status === "uploading" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs text-muted-foreground truncate"
              style={{ maxWidth: "200px" }}
            >
              {fileName ?? "Uploading…"}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-xs font-mono"
                style={{ color: "oklch(0.82 0.19 152)" }}
              >
                {Math.round(state.progress)}%
              </span>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label="Cancel upload"
                  data-ocid="upload.cancel.button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="upload-progress">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${state.progress}%`,
                background: "oklch(0.82 0.19 152)",
              }}
            />
          </div>
        </>
      )}

      {state.status === "error" && (
        <div className="flex items-start gap-2">
          <AlertCircle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "oklch(0.65 0.18 25)" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground font-medium">Upload failed</p>
            <p
              className="text-[11px] text-muted-foreground truncate mt-0.5"
              title={state.message}
            >
              {state.message}
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg flex-shrink-0 transition-colors"
              style={{
                background: "oklch(0.82 0.19 152 / 0.15)",
                color: "oklch(0.82 0.19 152)",
                border: "1px solid oklch(0.82 0.19 152 / 0.3)",
              }}
              data-ocid="upload.retry.button"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
