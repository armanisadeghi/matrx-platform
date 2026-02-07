import { z } from "zod";

export const errorBreadcrumbSchema = z.object({
  timestamp: z.string(),
  category: z.string().max(50),
  message: z.string().max(1000),
  level: z.enum(["fatal", "error", "warning", "info"]).default("info"),
  data: z.record(z.unknown()).optional(),
});

export const errorReportSchema = z.object({
  message: z.string().min(1).max(8192),
  stackTrace: z.string().max(65536).optional(),
  level: z.enum(["fatal", "error", "warning", "info"]).default("error"),
  platform: z.enum(["web", "mobile_ios", "mobile_android", "server"]),
  environment: z.string().max(50).default("production"),
  release: z.string().max(100).optional(),
  userId: z.string().uuid().optional(),
  url: z.string().max(2048).optional(),
  component: z.string().max(200).optional(),
  action: z.string().max(200).optional(),
  breadcrumbs: z.array(errorBreadcrumbSchema).max(100).default([]),
  context: z.record(z.unknown()).default({}),
  tags: z.record(z.string().max(200)).default({}),
  fingerprint: z.string().max(64).optional(),
});

export type ErrorReportInput = z.infer<typeof errorReportSchema>;

export const errorGroupFilterSchema = z.object({
  status: z.enum(["unresolved", "resolved", "ignored", "muted"]).optional(),
  level: z.enum(["fatal", "error", "warning", "info"]).optional(),
  platform: z.enum(["web", "mobile_ios", "mobile_android", "server"]).optional(),
  search: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type ErrorGroupFilterInput = z.infer<typeof errorGroupFilterSchema>;

export const updateErrorGroupSchema = z.object({
  status: z.enum(["unresolved", "resolved", "ignored", "muted"]).optional(),
  assignedTo: z.string().uuid().nullable().optional(),
});

export type UpdateErrorGroupInput = z.infer<typeof updateErrorGroupSchema>;
