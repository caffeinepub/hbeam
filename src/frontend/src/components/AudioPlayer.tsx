import { AlertCircle, Download, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, compact = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-attach listeners when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
    };
    const onError = () => setError(true);
    const onCanPlay = () => setLoaded(true);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || error) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setError(true));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  if (error) {
    return (
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2.5"
        style={{
          background: "oklch(0.16 0.013 240)",
          border: "1px solid oklch(0.25 0.016 240)",
        }}
        data-ocid="audio_player.error_state"
      >
        <AlertCircle
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "oklch(0.65 0.18 25)" }}
        />
        <span className="text-xs text-muted-foreground flex-1">
          Audio unavailable
        </span>
        <a
          href={src}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: "oklch(0.82 0.19 152)" }}
          aria-label="Download audio file"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3 rounded-xl px-3 py-2.5"
      style={{
        background: "oklch(0.16 0.014 240 / 0.6)",
        border: "1px solid oklch(0.28 0.018 240)",
        minWidth: compact ? "180px" : "220px",
        maxWidth: "300px",
      }}
      data-ocid="audio_player.container"
    >
      {/* Hidden audio element */}
      {/* biome-ignore lint/a11y/useMediaCaption: voice messages don't have captions */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play/pause button */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!loaded && !playing}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: "oklch(0.82 0.19 152)",
          color: "oklch(0.10 0.01 150)",
          opacity: !loaded && !playing ? 0.6 : 1,
        }}
        aria-label={playing ? "Pause audio" : "Play audio"}
        data-ocid="audio_player.play_button"
      >
        {playing ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </button>

      {/* Progress + time */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Waveform bars or progress bar */}
        {playing ? (
          <div className="flex items-end gap-0.5 h-5">
            {Array.from({ length: 24 }, (_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: purely decorative bars with stable count
                key={i}
                className="flex-1 rounded-full animate-waveform-play"
                style={{
                  background: "oklch(0.82 0.19 152)",
                  minHeight: "3px",
                  animationDelay: `${(i * 25) % 600}ms`,
                  animationDuration: "0.6s",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="progress-bar cursor-pointer h-1.5"
            onClick={handleSeek}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" && audioRef.current)
                audioRef.current.currentTime += 5;
              if (e.key === "ArrowLeft" && audioRef.current)
                audioRef.current.currentTime -= 5;
            }}
            role="slider"
            tabIndex={0}
            aria-label="Audio progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            data-ocid="audio_player.progress_bar"
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Time display */}
        <div className="flex justify-between items-center">
          <span className="time-display text-[10px]">
            {formatDuration(currentTime)}
          </span>
          <span className="time-display text-[10px]">
            {formatDuration(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
