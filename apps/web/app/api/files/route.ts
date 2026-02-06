import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { features } from "@/lib/features";
import { uploadFile, deleteFile } from "@/lib/storage";
import { UPLOAD_LIMITS, STORAGE_BUCKETS, PAGINATION } from "@matrx/shared";
import type { ApiResponse, ApiMeta } from "@matrx/shared";

/**
 * File Management API
 *
 * GET    — List the authenticated user's files from file_metadata.
 * POST   — Upload a file (multipart form data) to Supabase Storage
 *          and create a corresponding file_metadata record.
 * DELETE — Delete a file from both storage and the file_metadata table.
 */

interface FileMetadata {
  id: string;
  user_id: string;
  bucket: string;
  path: string;
  filename: string;
  content_type: string;
  size: number;
  public_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function GET(request: NextRequest) {
  if (!features.fileStorage) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page")) || PAGINATION.DEFAULT_PAGE);
    const perPage = Math.min(
      PAGINATION.MAX_PER_PAGE,
      Math.max(1, Number(searchParams.get("per_page")) || PAGINATION.DEFAULT_PER_PAGE)
    );

    const { data, count, error } = await supabase
      .from("file_metadata")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "DB_ERROR",
          message: `Failed to fetch files: ${error.message}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const total = count ?? 0;
    const meta: ApiMeta = {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    };

    const response: ApiResponse<FileMetadata[]> = {
      data: data as FileMetadata[],
      error: null,
      meta,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list files";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!features.fileStorage) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || STORAGE_BUCKETS.ATTACHMENTS;

    if (!file) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "No file provided. Include a 'file' field in the form data.",
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validate file size
    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
      const maxMb = UPLOAD_LIMITS.MAX_FILE_SIZE / (1024 * 1024);
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "FILE_TOO_LARGE",
          message: `File exceeds the maximum size of ${maxMb}MB`,
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Build the storage path: user-id/timestamp-filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${user.id}/${timestamp}-${sanitizedName}`;

    const { data: uploadedPath, error: uploadError } = await uploadFile(
      bucket,
      storagePath,
      file,
      { contentType: file.type }
    );

    if (uploadError) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "UPLOAD_ERROR",
          message: `File upload failed: ${uploadError}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Construct public URL for public buckets
    const isPublicBucket = bucket === STORAGE_BUCKETS.PUBLIC;
    const publicUrl = isPublicBucket
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${uploadedPath}`
      : null;

    // Create file_metadata record
    const { data: metadata, error: dbError } = await supabase
      .from("file_metadata")
      .insert({
        user_id: user.id,
        bucket,
        path: uploadedPath,
        filename: file.name,
        content_type: file.type,
        size: file.size,
        public_url: publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      // Attempt to clean up the uploaded file if metadata insert fails
      await deleteFile(bucket, uploadedPath!);

      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "DB_ERROR",
          message: `Failed to save file metadata: ${dbError.message}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<FileMetadata> = {
      data: metadata as FileMetadata,
      error: null,
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload file";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!features.fileStorage) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      const response: ApiResponse<null> = {
        data: null,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      };
      return NextResponse.json(response, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const fileId = searchParams.get("id");

    if (!fileId) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "VALIDATION_ERROR",
          message: "File ID is required. Pass it as ?id=<file_id>",
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Fetch the file metadata (only if it belongs to the user)
    const { data: fileMeta, error: fetchError } = await supabase
      .from("file_metadata")
      .select("*")
      .eq("id", fileId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !fileMeta) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "NOT_FOUND",
          message: "File not found or you do not have permission to delete it",
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    const meta = fileMeta as FileMetadata;

    // Delete from storage
    const { error: storageError } = await deleteFile(meta.bucket, meta.path);
    if (storageError) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "STORAGE_ERROR",
          message: `Failed to delete file from storage: ${storageError}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    // Delete metadata record
    const { error: dbError } = await supabase
      .from("file_metadata")
      .delete()
      .eq("id", fileId)
      .eq("user_id", user.id);

    if (dbError) {
      const response: ApiResponse<null> = {
        data: null,
        error: {
          code: "DB_ERROR",
          message: `Failed to delete file metadata: ${dbError.message}`,
        },
      };
      return NextResponse.json(response, { status: 500 });
    }

    const response: ApiResponse<{ id: string; deleted: boolean }> = {
      data: { id: fileId, deleted: true },
      error: null,
    };
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete file";
    const response: ApiResponse<null> = {
      data: null,
      error: { code: "INTERNAL_ERROR", message },
    };
    return NextResponse.json(response, { status: 500 });
  }
}
