import { MCPMessage, ResourceQuery, APIKey, AgentResponse } from '@/types';
import { ResourceManager } from './resource-manager';

export class MCPServer {
  private resourceManager: ResourceManager;
  private messageId = 0;

  constructor(resourceManager: ResourceManager) {
    this.resourceManager = resourceManager;
  }

  private generateId(): string {
    return `mcp_${++this.messageId}_${Date.now()}`;
  }

  async handleMessage(message: MCPMessage): Promise<MCPMessage> {
    try {
      switch (message.method) {
        case 'resources/list':
          return this.handleResourcesList(message);
        
        case 'resources/query':
          return this.handleResourcesQuery(message);
        
        case 'resources/call':
          return this.handleResourcesCall(message);
        
        case 'agent/auto-select':
          return this.handleAgentAutoSelect(message);
        
        case 'keys/add':
          return this.handleKeysAdd(message);
        
        case 'keys/list':
          return this.handleKeysList(message);
        
        default:
          return this.createErrorResponse(message, -32601, `Method not found: ${message.method}`);
      }
    } catch (error) {
      return this.createErrorResponse(
        message, 
        -32603, 
        error instanceof Error ? error.message : 'Internal error'
      );
    }
  }

  private handleResourcesList(message: MCPMessage): MCPMessage {
    const resources = this.resourceManager.getAvailableResources();
    return {
      id: message.id,
      type: 'response',
      result: {
        resources: resources.map(r => ({
          id: r.id,
          name: r.name,
          type: r.type,
          provider: r.provider,
          capabilities: r.capabilities,
          requiresAuth: r.requiresAuth,
          hasValidKey: r.apiKeyId ? true : false
        }))
      }
    };
  }

  private handleResourcesQuery(message: MCPMessage): MCPMessage {
    const query = message.params as Partial<ResourceQuery>;
    if (!query?.capability) {
      return this.createErrorResponse(message, -32602, 'Missing required capability parameter');
    }
    
    const resources = this.resourceManager.findAllResources(query as ResourceQuery);
    
    return {
      id: message.id,
      type: 'response',
      result: {
        resources: resources.map(r => ({
          id: r.id,
          name: r.name,
          type: r.type,
          provider: r.provider,
          capabilities: r.capabilities
        })),
        count: resources.length
      }
    };
  }

  private async handleResourcesCall(message: MCPMessage): Promise<MCPMessage> {
    const params = message.params as { resourceId?: string; params?: Record<string, unknown> };
    
    if (!params?.resourceId) {
      return this.createErrorResponse(message, -32602, 'Missing resourceId parameter');
    }
    
    const response = await this.resourceManager.executeResourceCall(
      params.resourceId, 
      params.params || {}
    );
    
    return {
      id: message.id,
      type: 'response',
      result: response as unknown as Record<string, unknown>
    };
  }

  private async handleAgentAutoSelect(message: MCPMessage): Promise<MCPMessage> {
    const params = message.params as { task?: string };
    
    if (!params?.task) {
      return this.createErrorResponse(message, -32602, 'Missing task parameter');
    }
    
    const resource = await this.resourceManager.autoSelectResource(params.task);
    
    return {
      id: message.id,
      type: 'response',
      result: {
        resource: resource ? {
          id: resource.id,
          name: resource.name,
          type: resource.type,
          provider: resource.provider,
          capabilities: resource.capabilities
        } : null,
        suggestion: resource ? `Selected ${resource.name} for this task` : 'No suitable resource found'
      }
    };
  }

  private handleKeysAdd(message: MCPMessage): MCPMessage {
    const apiKeyData = message.params as Partial<APIKey>;
    
    if (!apiKeyData?.name || !apiKeyData?.value || !apiKeyData?.provider || !apiKeyData?.type) {
      return this.createErrorResponse(message, -32602, 'Missing required API key fields');
    }
    
    this.resourceManager.addAPIKey({
      id: this.generateId(),
      name: apiKeyData.name,
      value: apiKeyData.value,
      provider: apiKeyData.provider,
      type: apiKeyData.type,
      lastValidated: new Date()
    });
    
    return {
      id: message.id,
      type: 'response',
      result: {
        success: true,
        message: `API key for ${apiKeyData.provider} added successfully`
      }
    };
  }

  private handleKeysList(message: MCPMessage): MCPMessage {
    const keys = this.resourceManager.getConfiguredAPIKeys();
    return {
      id: message.id,
      type: 'response',
      result: {
        keys: keys.map(k => ({
          id: k.id,
          name: k.name,
          provider: k.provider,
          type: k.type,
          hasValue: !!k.value
        }))
      }
    };
  }

  private createErrorResponse(originalMessage: MCPMessage, code: number, message: string): MCPMessage {
    return {
      id: originalMessage.id,
      type: 'response',
      error: {
        code,
        message,
        data: null
      }
    };
  }

  // Helper method to create MCP request messages
  static createRequest(method: string, params?: Record<string, unknown>): MCPMessage {
    return {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'request',
      method,
      params
    };
  }

  // Helper method to create MCP notification messages
  static createNotification(method: string, params?: Record<string, unknown>): MCPMessage {
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'notification',
      method,
      params
    };
  }
}