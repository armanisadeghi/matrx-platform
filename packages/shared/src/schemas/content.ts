import { z } from "zod";

/**
 * Content Validation Schemas
 *
 * Shared validation for blog posts, dynamic pages, and file uploads.
 */

// ============================================================================
// Blog
// ============================================================================

export const createBlogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be at most 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  excerpt: z.string().max(500, "Excerpt must be at most 500 characters").optional(),
  content: z.string().default(""),
  contentFormat: z.enum(["markdown", "html", "rich_text"]).default("markdown"),
  coverImageUrl: z.string().url("Invalid URL").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string().max(50)).max(10).default([]),
  seoTitle: z.string().max(70, "SEO title should be at most 70 characters").optional(),
  seoDescription: z
    .string()
    .max(160, "SEO description should be at most 160 characters")
    .optional(),
  seoKeywords: z.array(z.string().max(50)).max(10).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  parentId: z.string().uuid("Invalid parent ID").optional(),
  sortOrder: z.number().int().default(0),
});

// ============================================================================
// Dynamic Pages
// ============================================================================

export const createDynamicPageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be at most 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only"
    ),
  content: z.string().default(""),
  contentType: z.enum(["html", "react", "markdown"]).default("html"),
  isSandboxed: z.boolean().default(true),
  customCss: z.string().max(50000, "CSS is too large").optional(),
  headTags: z.string().max(5000, "Head tags are too large").optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  layout: z.enum(["default", "full_width", "sidebar", "blank"]).default("default"),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const updateDynamicPageSchema = createDynamicPageSchema.partial();

// ============================================================================
// File Uploads
// ============================================================================

export const fileUploadSchema = z.object({
  bucket: z.string().min(1, "Bucket is required"),
  category: z.string().max(50).optional(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
});

// ============================================================================
// Inferred Types
// ============================================================================

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogCategoryInput = z.infer<typeof blogCategorySchema>;
export type CreateDynamicPageInput = z.infer<typeof createDynamicPageSchema>;
export type UpdateDynamicPageInput = z.infer<typeof updateDynamicPageSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
