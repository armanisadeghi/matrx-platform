/**
 * AI Agent Types
 *
 * Type definitions for the agent system.
 * Agents combine prompts with tools and can maintain conversation state.
 */

import type { AiProvider, ModelSettings } from "./prompts";

export interface Agent {
  id: string;
  name: string;
  description: string | null;
  systemPrompt: string;
  provider: AiProvider;
  model: string;
  settings: ModelSettings;
  tools: AgentTool[];
  memory: AgentMemoryConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  type: "function" | "api" | "database" | "file" | "custom";
  schema: Record<string, unknown>;
  config: Record<string, unknown>;
}

export interface AgentMemoryConfig {
  enabled: boolean;
  type: "conversation" | "summary" | "vector";
  maxMessages?: number;
  maxTokens?: number;
}

export interface AgentConversation {
  id: string;
  agentId: string;
  messages: AgentMessage[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  timestamp: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  result: unknown;
  error?: string;
}

export interface AgentChatRequest {
  agentId: string;
  conversationId?: string;
  message: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: "image" | "file" | "audio";
  url: string;
  mimeType: string;
  name: string;
}

export interface AgentChatResponse {
  conversationId: string;
  message: AgentMessage;
  toolsUsed: string[];
}
