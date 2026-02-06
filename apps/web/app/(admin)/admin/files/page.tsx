import type { Metadata } from "next";
import { features } from "@/lib/features";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Files",
};

/** Placeholder file data for when Supabase is not configured. */
const PLACEHOLDER_FILES = [
  {
    id: "1",
    name: "hero-banner.png",
    size: 245_760,
    type: "image/png",
    uploaded_by: "Alice Johnson",
    created_at: "2026-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "product-screenshot.jpg",
    size: 512_000,
    type: "image/jpeg",
    uploaded_by: "Bob Smith",
    created_at: "2026-01-15T14:30:00Z",
  },
  {
    id: "3",
    name: "whitepaper-2026.pdf",
    size: 2_048_000,
    type: "application/pdf",
    uploaded_by: "Carol Davis",
    created_at: "2026-01-22T09:15:00Z",
  },
  {
    id: "4",
    name: "logo-dark.svg",
    size: 8_192,
    type: "image/svg+xml",
    uploaded_by: "Alice Johnson",
    created_at: "2025-12-05T16:45:00Z",
  },
  {
    id: "5",
    name: "onboarding-video.mp4",
    size: 15_360_000,
    type: "video/mp4",
    uploaded_by: "Dan Wilson",
    created_at: "2026-02-01T11:00:00Z",
  },
  {
    id: "6",
    name: "data-export.csv",
    size: 102_400,
    type: "text/csv",
    uploaded_by: "Eve Martinez",
    created_at: "2026-02-04T08:30:00Z",
  },
];

interface FileRow {
  id: string;
  name: string;
  size: number;
  type: string;
  uploaded_by: string;
  created_at: string;
}

/**
 * Fetch files from Supabase, or return placeholder data.
 */
async function getFiles(): Promise<FileRow[]> {
  if (!features.fileStorage) {
    return PLACEHOLDER_FILES;
  }

  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("files")
      .select("id, name, size, type, uploaded_by, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return PLACEHOLDER_FILES;
    }

    return data as FileRow[];
  } catch {
    return PLACEHOLDER_FILES;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Return a file type icon based on MIME type. */
function FileIcon({ type }: { type: string }) {
  if (type.startsWith("image/")) {
    return (
      <svg
        className="h-8 w-8 text-info"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
        />
      </svg>
    );
  }

  if (type === "application/pdf") {
    return (
      <svg
        className="h-8 w-8 text-error"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
        />
      </svg>
    );
  }

  if (type.startsWith("video/")) {
    return (
      <svg
        className="h-8 w-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-8 w-8 text-foreground-muted"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      />
    </svg>
  );
}

/** Return a short file type label from MIME type. */
function fileTypeLabel(mimeType: string): string {
  const map: Record<string, string> = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "image/svg+xml": "SVG",
    "image/gif": "GIF",
    "image/webp": "WebP",
    "application/pdf": "PDF",
    "video/mp4": "MP4",
    "text/csv": "CSV",
    "application/json": "JSON",
  };
  return map[mimeType] ?? mimeType.split("/").pop()?.toUpperCase() ?? "File";
}

/**
 * Files Management Page
 *
 * Server Component with a grid view of uploaded files and an upload placeholder.
 */
export default async function FilesPage() {
  const files = await getFiles();
  const isPlaceholder = !features.fileStorage;

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Files</h1>
          <p className="mt-1 text-foreground-secondary">
            Manage uploaded files and media.
          </p>
        </div>
        <span className="text-sm text-foreground-muted">
          {files.length} file{files.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Placeholder notice */}
      {isPlaceholder && (
        <div className="rounded-lg border border-border bg-warning-light px-4 py-3">
          <p className="text-sm font-medium text-warning">
            File storage feature is disabled. Showing placeholder data.
          </p>
          <p className="mt-1 text-xs text-foreground-secondary">
            Enable the fileStorage feature flag and configure Supabase to manage
            real files.
          </p>
        </div>
      )}

      {/* Upload area placeholder */}
      <div className="rounded-xl border-2 border-dashed border-border bg-background-secondary p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="h-10 w-10 text-foreground-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="mt-3 text-sm font-medium text-foreground">
            Upload files
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            Drag and drop files here, or click to browse.
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            PNG, JPG, PDF, SVG, CSV up to 10MB
          </p>
        </div>
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-background-secondary"
          >
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-background-secondary p-2">
              <FileIcon type={file.type} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-background-tertiary px-1.5 py-0.5 text-xs font-medium text-foreground-secondary">
                  {fileTypeLabel(file.type)}
                </span>
                <span className="text-xs text-foreground-muted">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-foreground-muted">
                <span>{file.uploaded_by}</span>
                <span>·</span>
                <span>{formatDate(file.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-sm text-foreground-muted">No files uploaded yet.</p>
        </div>
      )}
    </div>
  );
}
