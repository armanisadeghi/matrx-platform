/**
 * AI Prompt Types
 *
 * Type definitions for the prompt system.
 * These map to the structures in the Matrx AI integration dashboard.
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  provider: AiProvider;
  model: string;
  settings: ModelSettings;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVariable {
  name: string;
  type: "string" | "number" | "boolean" | "json";
  description: string;
  required: boolean;
  defaultValue?: string;
}

export interface ModelSettings {
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
}

export type AiProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "mistral"
  | "cohere"
  | "custom";

export interface PromptExecutionRequest {
  promptId: string;
  variables: Record<string, unknown>;
  overrides?: Partial<ModelSettings>;
}

export interface PromptExecutionResponse {
  id: string;
  promptId: string;
  content: string;
  usage: TokenUsage;
  latencyMs: number;
  provider: AiProvider;
  model: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
