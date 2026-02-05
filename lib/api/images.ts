/**
 * Image Upload & Optimization Patterns
 *
 * CRITICAL: Always generate and store blurhash for uploaded images.
 *
 * Setup required:
 * 1. pnpm add blurhash expo-image-manipulator
 * 2. Configure Supabase Storage bucket
 */

// import { encode } from "blurhash";
// import * as ImageManipulator from "expo-image-manipulator";
// import { supabase } from "./supabase";
import { getOptimizedSupabaseUrl } from "../performance";

/**
 * Image upload configuration
 */
export const IMAGE_CONFIG = {
  /** Maximum image dimension for uploads */
  MAX_SIZE: 1920,
  /** JPEG quality for uploads */
  UPLOAD_QUALITY: 0.85,
  /** Blurhash components */
  BLURHASH_X: 4,
  BLURHASH_Y: 3,
  /** Storage bucket name */
  BUCKET: "images",
};

/**
 * Example: Upload image with blurhash generation
 *
 * @example
 * ```ts
 * const result = await uploadImage(imageUri, "avatars", userId);
 * // result = { url: "https://...", blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj" }
 * ```
 */
export async function uploadImage(
  uri: string,
  folder: string,
  filename: string
): Promise<{ url: string; blurhash: string }> {
  // 1. Resize image if needed
  // const manipulated = await ImageManipulator.manipulateAsync(
  //   uri,
  //   [{ resize: { width: IMAGE_CONFIG.MAX_SIZE } }],
  //   {
  //     compress: IMAGE_CONFIG.UPLOAD_QUALITY,
  //     format: ImageManipulator.SaveFormat.JPEG,
  //   }
  // );

  // 2. Generate blurhash from resized image
  // const blurhash = await generateBlurhash(manipulated.uri);

  // 3. Upload to Supabase Storage
  // const { data, error } = await supabase.storage
  //   .from(IMAGE_CONFIG.BUCKET)
  //   .upload(`${folder}/${filename}.jpg`, {
  //     uri: manipulated.uri,
  //     type: "image/jpeg",
  //     name: `${filename}.jpg`,
  //   } as unknown as File);
  //
  // if (error) throw error;

  // 4. Get public URL
  // const { data: urlData } = supabase.storage
  //   .from(IMAGE_CONFIG.BUCKET)
  //   .getPublicUrl(data.path);

  // Placeholder
  return {
    url: `https://example.supabase.co/storage/v1/object/public/${folder}/${filename}.jpg`,
    blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
  };
}

/**
 * Generate blurhash from image URI
 *
 * Note: This requires additional setup with canvas on native.
 * Consider generating blurhash server-side for better performance.
 *
 * Server-side alternative (Supabase Edge Function):
 *
 * ```ts
 * // supabase/functions/generate-blurhash/index.ts
 * import { encode } from "blurhash";
 * import sharp from "sharp";
 *
 * Deno.serve(async (req) => {
 *   const { imageUrl } = await req.json();
 *
 *   const response = await fetch(imageUrl);
 *   const buffer = await response.arrayBuffer();
 *
 *   const { data, info } = await sharp(buffer)
 *     .resize(32, 32, { fit: "inside" })
 *     .raw()
 *     .ensureAlpha()
 *     .toBuffer({ resolveWithObject: true });
 *
 *   const blurhash = encode(
 *     new Uint8ClampedArray(data),
 *     info.width,
 *     info.height,
 *     4,
 *     3
 *   );
 *
 *   return new Response(JSON.stringify({ blurhash }));
 * });
 * ```
 */
async function generateBlurhash(uri: string): Promise<string> {
  // Client-side blurhash generation requires canvas
  // which is complex on React Native. Recommend server-side.
  return "LEHV6nWB2yk8pyo0adR*.7kCMdnj";
}

/**
 * Get optimized image URL for display
 *
 * REQUIRED: Always use this for displaying Supabase images.
 *
 * @example
 * ```tsx
 * <Image
 *   source={getImageUrl(item.image_url, 400)}
 *   blurhash={item.blurhash}
 * />
 * ```
 */
export function getImageUrl(url: string, width: number): string {
  return getOptimizedSupabaseUrl(url, {
    width,
    quality: 80,
    format: "webp",
  });
}

/**
 * Database schema for images table
 *
 * SQL to create:
 *
 * ```sql
 * CREATE TABLE images (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   url TEXT NOT NULL,
 *   blurhash TEXT NOT NULL,
 *   width INTEGER NOT NULL,
 *   height INTEGER NOT NULL,
 *   size_bytes INTEGER NOT NULL,
 *   mime_type TEXT NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   user_id UUID REFERENCES auth.users(id)
 * );
 *
 * -- Index for user's images
 * CREATE INDEX idx_images_user_id ON images(user_id);
 * ```
 */
export interface ImageRecord {
  id: string;
  url: string;
  blurhash: string;
  width: number;
  height: number;
  size_bytes: number;
  mime_type: string;
  created_at: string;
  user_id: string;
}
