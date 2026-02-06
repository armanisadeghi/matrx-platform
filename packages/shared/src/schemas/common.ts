import { z } from "zod";

/**
 * Common Validation Schemas
 *
 * Reusable schema building blocks for forms and API validation.
 */

/** UUID validation */
export const uuidSchema = z.string().uuid("Invalid ID format");

/** Pagination query params */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

/** Search query params */
export const searchSchema = z.object({
  query: z.string().min(1).max(200),
  ...paginationSchema.shape,
});

/** Workspace creation */
export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});

/** AI Integration creation */
export const createAiIntegrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  type: z.enum(["prompt", "agent", "workflow"]),
  config: z.record(z.unknown()).default({}),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type CreateAiIntegrationInput = z.infer<
  typeof createAiIntegrationSchema
>;
