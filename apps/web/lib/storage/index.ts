import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Supabase Storage Utilities
 *
 * Server-side helpers for managing files in Supabase Storage.
 * All functions create their own Supabase client to ensure
 * proper cookie-based auth context.
 */

/**
 * Upload a file to a Supabase Storage bucket.
 *
 * @param bucket  - The storage bucket name
 * @param path    - The file path within the bucket (e.g. "user-123/avatar.png")
 * @param file    - The file to upload (File, Blob, or ArrayBuffer)
 * @param options - Optional upload configuration
 * @returns The uploaded file path, or an error
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob | ArrayBuffer,
  options?: {
    contentType?: string;
    upsert?: boolean;
    cacheControl?: string;
  }
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false,
      cacheControl: options?.cacheControl ?? "3600",
    });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data.path, error: null };
}

/**
 * Delete a file from a Supabase Storage bucket.
 *
 * @param bucket - The storage bucket name
 * @param path   - The file path within the bucket
 * @returns Success status or an error
 */
export async function deleteFile(bucket: string, path: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: true, error: null };
}

/**
 * Get a public URL for a file in a public Supabase Storage bucket.
 *
 * @param bucket - The storage bucket name (must be public)
 * @param path   - The file path within the bucket
 * @returns The public URL string
 */
export function getPublicUrl(bucket: string, path: string): string {
  // Public URLs can be constructed without authentication
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Get a signed (temporary) URL for a file in a private Supabase Storage bucket.
 *
 * @param bucket    - The storage bucket name
 * @param path      - The file path within the bucket
 * @param expiresIn - Seconds until the URL expires (default: 3600 = 1 hour)
 * @returns The signed URL, or an error
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data.signedUrl, error: null };
}

/**
 * List files in a folder within a Supabase Storage bucket.
 *
 * @param bucket - The storage bucket name
 * @param folder - The folder path to list (e.g. "user-123/documents")
 * @param options - Optional listing configuration
 * @returns An array of file objects, or an error
 */
export async function listFiles(
  bucket: string,
  folder: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: "asc" | "desc" };
  }
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: options?.limit ?? 100,
    offset: options?.offset ?? 0,
    sortBy: options?.sortBy ?? { column: "created_at", order: "desc" },
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
