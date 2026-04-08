import { Loader2, Mic, MicOff, RotateCcw, Send, Square, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AudioPlayer } from "./AudioPlayer";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, durationSeconds: number) => Promise<void>;
  onClose: () => void;
  isSending?: boolean;
}

type RecorderState =
  | { phase: "idle" }
  | { phase: "recording"; startTime: number }
  | { phase: "preview"; blob: Blob; durationSeconds: number; objectUrl: string }
  | { phase: "error"; message: string };

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VoiceRecorder({
  onSend,
  onClose,
  isSending = false,
}: VoiceRecorderProps) {
  const [state, setState] = useState<RecorderState>({ phase: "idle" });
  const [elapsed, setElapsed] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup on unmount — empty deps intentional, refs are stable
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) track.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const durationSeconds = (Date.now() - startTimeRef.current) / 1000;
        const objectUrl = URL.createObjectURL(blob);
        setState({ phase: "preview", blob, durationSeconds, objectUrl });
        setElapsed(0);
        for (const track of stream.getTracks()) track.stop();
      };

      startTimeRef.current = Date.now();
      setState({ phase: "recording", startTime: Date.now() });
      recorder.start(100);

      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      const isDenied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError");
      if (isDenied) {
        setPermissionDenied(true);
      } else {
        setState({
          phase: "error",
          message:
            "Could not access microphone. Please check your device settings.",
        });
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
  }, []);

  const handleSend = useCallback(async () => {
    if (state.phase !== "preview") return;
    const { blob, durationSeconds, objectUrl } = state;
    try {
      await onSend(blob, durationSeconds);
      URL.revokeObjectURL(objectUrl);
    } catch {
      // error handling is done by parent
    }
  }, [state, onSend]);

  const handleDiscard = useCallback(() => {
    if (state.phase === "preview") {
      URL.revokeObjectURL(state.objectUrl);
    }
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
    }
    setState({ phase: "idle" });
    setElapsed(0);
  }, [state]);

  return (
    <div
      className="voice-recorder-modal animate-slide-up"
      data-ocid="voice_recorder.modal"
    >
      <div
        className="voice-recorder-panel w-full max-w-md"
        style={{ background: "oklch(0.14 0.013 240)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Voice Message</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close recorder"
            data-ocid="voice_recorder.close.button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permission denied */}
        {permissionDenied && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 my-2"
            style={{
              background: "oklch(0.62 0.22 25 / 0.1)",
              border: "1px solid oklch(0.62 0.22 25 / 0.3)",
            }}
            data-ocid="voice_recorder.permission_denied"
          >
            <MicOff
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "oklch(0.65 0.18 25)" }}
            />
            <p className="text-sm text-foreground">
              Microphone access required to record. Please enable it in your
              browser settings.
            </p>
          </div>
        )}

        {/* Error state */}
        {state.phase === "error" && (
          <div
            className="rounded-xl px-4 py-3 my-2 text-sm"
            style={{
              background: "oklch(0.62 0.22 25 / 0.1)",
              border: "1px solid oklch(0.62 0.22 25 / 0.3)",
              color: "oklch(0.65 0.18 25)",
            }}
          >
            {state.message}
          </div>
        )}

        {/* Idle state: start button */}
        {(state.phase === "idle" || state.phase === "error") &&
          !permissionDenied && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div
                className="text-xs text-muted-foreground text-center"
                style={{ maxWidth: "240px" }}
              >
                Tap the microphone to start recording your voice message
              </div>
              <button
                type="button"
                onClick={startRecording}
                className="recorder-button-primary shadow-mint"
                aria-label="Start recording"
                data-ocid="voice_recorder.start.button"
              >
                <Mic className="w-7 h-7" />
              </button>
            </div>
          )}

        {/* Recording state */}
        {state.phase === "recording" && (
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Animated indicator */}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse-glow"
                style={{ background: "oklch(0.65 0.18 25)" }}
              />
              <span
                className="time-display text-lg"
                data-ocid="voice_recorder.elapsed_time"
              >
                {formatTime(elapsed)}
              </span>
            </div>

            {/* Waveform decoration */}
            <div className="flex items-end gap-0.5 h-8 w-48">
              {Array.from({ length: 28 }, (_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: decorative bars
                  key={i}
                  className="flex-1 rounded-full animate-waveform-play"
                  style={{
                    background: "oklch(0.82 0.19 152)",
                    minHeight: "3px",
                    animationDelay: `${(i * 22) % 600}ms`,
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={stopRecording}
              className="recorder-button"
              style={{
                background: "oklch(0.62 0.22 25 / 0.15)",
                color: "oklch(0.65 0.18 25)",
                border: "2px solid oklch(0.62 0.22 25 / 0.5)",
              }}
              aria-label="Stop recording"
              data-ocid="voice_recorder.stop.button"
            >
              <Square className="w-6 h-6" />
            </button>
            <span className="text-xs text-muted-foreground">Tap to stop</span>
          </div>
        )}

        {/* Preview state */}
        {state.phase === "preview" && (
          <div className="space-y-4 py-2">
            <div className="text-xs text-muted-foreground text-center">
              Preview your voice message before sending
            </div>
            <div className="flex justify-center">
              <AudioPlayer src={state.objectUrl} />
            </div>

            <div className="flex gap-3 justify-center">
              {/* Discard */}
              <button
                type="button"
                onClick={handleDiscard}
                disabled={isSending}
                className="recorder-button-secondary w-auto px-5 h-11 rounded-full text-sm font-medium disabled:opacity-40"
                data-ocid="voice_recorder.discard.button"
              >
                <RotateCcw className="w-4 h-4 mr-2 opacity-50" />
                Re-record
              </button>

              {/* Send */}
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                className="recorder-button w-auto px-6 h-11 rounded-full text-sm font-semibold disabled:opacity-40"
                style={{
                  background: "oklch(0.82 0.19 152)",
                  color: "oklch(0.10 0.01 150)",
                }}
                data-ocid="voice_recorder.send.button"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
