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
