/**
 * Workflow Types
 *
 * Type definitions for the workflow orchestration system.
 * Workflows chain together multiple AI operations, tools, and conditions.
 */

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables: WorkflowVariable[];
  triggers: WorkflowTrigger[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowNodeType =
  | "prompt"
  | "agent"
  | "condition"
  | "loop"
  | "transform"
  | "api_call"
  | "database"
  | "delay"
  | "notification"
  | "human_review"
  | "input"
  | "output";

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
  label?: string;
}

export interface WorkflowVariable {
  name: string;
  type: "string" | "number" | "boolean" | "json" | "array";
  scope: "input" | "output" | "internal";
  defaultValue?: unknown;
}

export type WorkflowTriggerType =
  | "manual"
  | "schedule"
  | "webhook"
  | "event"
  | "api";

export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  config: Record<string, unknown>;
}

export interface WorkflowExecutionRequest {
  workflowId: string;
  inputs: Record<string, unknown>;
  async?: boolean;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: WorkflowExecutionStatus;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown> | null;
  nodeExecutions: NodeExecution[];
  startedAt: string;
  completedAt: string | null;
  error: string | null;
}

export type WorkflowExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "waiting_for_review";

export interface NodeExecution {
  nodeId: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  input: unknown;
  output: unknown;
  startedAt: string | null;
  completedAt: string | null;
  error: string | null;
}
