import type { ApiResponse } from "@matrx/shared";
import type {
  PromptExecutionRequest,
  PromptExecutionResponse,
} from "./types/prompts";
import type { AgentChatRequest, AgentChatResponse } from "./types/agents";
import type {
  WorkflowExecutionRequest,
  WorkflowExecution,
} from "./types/workflows";

/**
 * Matrx AI Client
 *
 * Platform-agnostic client for interacting with the AI integration API.
 * Both web and mobile apps use this client, providing their own base URL
 * and auth token retrieval mechanism.
 */
export interface AiClientConfig {
  /** Base URL of the Next.js API (e.g., https://app.example.com) */
  baseUrl: string;
  /** Function that returns the current auth token */
  getToken: () => Promise<string | null>;
}

export class MatrxAiClient {
  private config: AiClientConfig;

  constructor(config: AiClientConfig) {
    this.config = config;
  }

  /** Execute a prompt template with variables */
  async executePrompt(
    request: PromptExecutionRequest
  ): Promise<ApiResponse<PromptExecutionResponse>> {
    return this.post("/api/ai/chat", request);
  }

  /** Send a message to an AI agent */
  async chatWithAgent(
    request: AgentChatRequest
  ): Promise<ApiResponse<AgentChatResponse>> {
    return this.post("/api/ai/agents", request);
  }

  /** Execute a workflow */
  async executeWorkflow(
    request: WorkflowExecutionRequest
  ): Promise<ApiResponse<WorkflowExecution>> {
    return this.post("/api/ai/workflows", request);
  }

  /** Get the status of a workflow execution */
  async getWorkflowExecution(
    executionId: string
  ): Promise<ApiResponse<WorkflowExecution>> {
    return this.get(`/api/ai/workflows/${executionId}`);
  }

  private async get<T>(path: string): Promise<ApiResponse<T>> {
    const token = await this.config.getToken();
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return response.json() as Promise<ApiResponse<T>>;
  }

  private async post<T>(
    path: string,
    body: unknown
  ): Promise<ApiResponse<T>> {
    const token = await this.config.getToken();
    const response = await fetch(`${this.config.baseUrl}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return response.json() as Promise<ApiResponse<T>>;
  }
}
