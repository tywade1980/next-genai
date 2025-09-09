// Core data types for the GenAI application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}

export interface CallRecord {
  id: string;
  userId: string;
  phoneNumber: string;
  duration: number;
  timestamp: Date;
  aiModelUsed: 'gpt-4' | 'claude-3' | 'gemini-pro';
  transcription?: string;
  summary?: string;
  status: 'completed' | 'failed' | 'in-progress';
}

export interface AIModel {
  id: string;
  name: string;
  type: 'gpt-4' | 'claude-3' | 'gemini-pro';
  version: string;
  capabilities: string[];
  isActive: boolean;
}

export interface CBMSProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  startDate: Date;
  endDate?: Date;
  managerId: string;
  teamMembers: string[];
  budget: number;
  tasks: CBMSTask[];
}

export interface CBMSTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppVersion {
  version: string;
  platform: 'web' | 'android' | 'ios';
  releaseDate: Date;
  features: string[];
  bugFixes: string[];
  isRequired: boolean;
  downloadUrl?: string;
}

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'user' | 'call' | 'project' | 'task';
  entityId: string;
  data: any;
  timestamp: Date;
  userId: string;
}