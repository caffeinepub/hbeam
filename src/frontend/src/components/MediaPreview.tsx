import {
  Download,
  ExternalLink,
  File,
  FileSpreadsheet,
  FileText,
  Film,
  Image,
  Music,
} from "lucide-react";
import { formatFileSize, getFileIcon } from "../hooks/useMediaUpload";
import { AudioPlayer } from "./AudioPlayer";

interface FileMetadata {
  fileName: string;
  fileSize: bigint;
  fileType: string;
}

interface MediaPreviewProps {
  url: string;
  metadata?: FileMetadata;
  messageType: string;
}

function FileTypeIcon({
  mimeType,
  className,
}: { mimeType: string; className?: string }) {
  const iconType = getFileIcon(mimeType);
  const cls = className ?? "w-6 h-6";
  switch (iconType) {
    case "image":
      return <Image className={cls} />;
    case "video":
      return <Film className={cls} />;
    case "audio":
      return <Music className={cls} />;
    case "pdf":
      return <FileText className={cls} />;
    case "spreadsheet":
      return <FileSpreadsheet className={cls} />;
    case "document":
      return <FileText className={cls} />;
    default:
      return <File className={cls} />;
  }
}

export function ImagePreview({
  url,
  fileName,
}: { url: string; fileName?: string }) {
  return (
    <div
      className="relative group media-thumbnail"
      style={{ maxWidth: "280px" }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View full image${fileName ? `: ${fileName}` : ""}`}
      >
        <img
          src={url}
          alt={fileName ?? "Image"}
          className="rounded-lg w-full object-cover"
          style={{ maxHeight: "220px" }}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="media-overlay rounded-lg">
          <ExternalLink
            className="w-5 h-5"
            style={{ color: "oklch(0.94 0.01 220)" }}
          />
        </div>
      </a>
      {fileName && (
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-1 rounded-b-lg text-[10px] text-muted-foreground truncate"
          style={{ background: "oklch(0 0 0 / 0.5)" }}
        >
          {fileName}
        </div>
      )}
    </div>
  );
}

export function MediaPreview({
  url,
  metadata,
  messageType,
}: MediaPreviewProps) {
  const fileName = metadata?.fileName;
  const fileType = metadata?.fileType ?? "";
  const fileSize = metadata?.fileSize ? Number(metadata.fileSize) : undefined;

  // Voice message — inline audio player
  if (messageType === "voice") {
    return <AudioPlayer src={url} data-ocid="media_preview.voice" />;
  }

  // Image preview — inline thumbnail
  if (messageType === "image" || fileType.startsWith("image/")) {
    return <ImagePreview url={url} fileName={fileName} />;
  }

  // Video message — name + size + download link
  if (messageType === "video" || fileType.startsWith("video/")) {
    return (
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "oklch(0.16 0.014 240)",
          border: "1px solid oklch(0.25 0.016 240)",
          maxWidth: "280px",
        }}
        data-ocid="media_preview.video"
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(0.82 0.19 152 / 0.15)" }}
          >
            <Film
              className="w-5 h-5"
              style={{ color: "oklch(0.82 0.19 152)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-foreground">
              {fileName ?? "Video"}
            </div>
            {fileSize !== undefined && (
              <div className="text-[11px] text-muted-foreground">
                {formatFileSize(fileSize)} · Video
              </div>
            )}
          </div>
          <a
            href={url}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style={{ color: "oklch(0.82 0.19 152)" }}
            aria-label={`Download ${fileName ?? "video"}`}
            data-ocid="media_preview.video_download"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // Generic file — name, size, icon, download
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "oklch(0.16 0.014 240)",
        border: "1px solid oklch(0.25 0.016 240)",
        maxWidth: "260px",
      }}
      data-ocid="media_preview.file"
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "oklch(0.82 0.19 152 / 0.12)" }}
        >
          <FileTypeIcon mimeType={fileType} className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate text-foreground">
            {fileName ?? "File"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {fileSize !== undefined ? formatFileSize(fileSize) : ""}
            {fileType
              ? ` · ${fileType.split("/")[1]?.toUpperCase() ?? "File"}`
              : ""}
          </div>
        </div>
        <a
          href={url}
          download={fileName}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg transition-colors flex-shrink-0"
          style={{ color: "oklch(0.82 0.19 152)" }}
          aria-label={`Download ${fileName ?? "file"}`}
          data-ocid="media_preview.file_download"
        >
          <Download className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
