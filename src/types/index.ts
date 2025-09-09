// Core types for the resource manager and API system

export interface APIKey {
  id: string;
  name: string;
  value: string;
  provider: string;
  type: 'openai' | 'anthropic' | 'google' | 'azure' | 'custom';
  isValid?: boolean;
  lastValidated?: Date;
}

export interface Resource {
  id: string;
  name: string;
  type: 'model' | 'api' | 'service' | 'tool';
  provider: string;
  endpoint?: string;
  requiresAuth: boolean;
  apiKeyId?: string;
  capabilities: string[];
  config?: Record<string, unknown>;
}

export interface MCPMessage {
  id: string;
  type: 'request' | 'response' | 'notification';
  method?: string;
  params?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface AgentTask {
  id: string;
  type: 'call' | 'message' | 'analysis' | 'management';
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  resourceId?: string;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ResourceQuery {
  capability: string;
  type?: string;
  provider?: string;
  requirements?: Record<string, unknown>;
}

export interface AgentResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  resourceUsed?: string;
  suggestions?: string[];
}