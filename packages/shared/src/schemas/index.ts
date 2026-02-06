export {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "./auth";
export type { LoginInput, RegisterInput, UpdateProfileInput } from "./auth";

export {
  uuidSchema,
  paginationSchema,
  searchSchema,
  createWorkspaceSchema,
  createAiIntegrationSchema,
} from "./common";
export type {
  PaginationInput,
  SearchInput,
  CreateWorkspaceInput,
  CreateAiIntegrationInput,
} from "./common";

export {
  createBlogPostSchema,
  updateBlogPostSchema,
  blogCategorySchema,
  createDynamicPageSchema,
  updateDynamicPageSchema,
  fileUploadSchema,
} from "./content";
export type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogCategoryInput,
  CreateDynamicPageInput,
  UpdateDynamicPageInput,
  FileUploadInput,
} from "./content";
