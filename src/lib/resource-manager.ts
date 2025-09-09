import { Resource, ResourceQuery, APIKey, AgentResponse } from '@/types';

export class ResourceManager {
  private resources: Map<string, Resource> = new Map();
  private apiKeys: Map<string, APIKey> = new Map();

  constructor() {
    // Initialize with default resources
    this.initializeDefaultResources();
  }

  private initializeDefaultResources() {
    const defaultResources: Resource[] = [
      {
        id: 'openai-gpt4',
        name: 'OpenAI GPT-4',
        type: 'model',
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        requiresAuth: true,
        capabilities: ['text-generation', 'conversation', 'analysis'],
        config: { model: 'gpt-4' }
      },
      {
        id: 'openai-whisper',
        name: 'OpenAI Whisper',
        type: 'model',
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1/audio/transcriptions',
        requiresAuth: true,
        capabilities: ['speech-to-text', 'transcription'],
        config: { model: 'whisper-1' }
      },
      {
        id: 'openai-tts',
        name: 'OpenAI Text-to-Speech',
        type: 'model',
        provider: 'openai',
        endpoint: 'https://api.openai.com/v1/audio/speech',
        requiresAuth: true,
        capabilities: ['text-to-speech', 'voice-generation'],
        config: { model: 'tts-1' }
      },
      {
        id: 'anthropic-claude',
        name: 'Anthropic Claude',
        type: 'model',
        provider: 'anthropic',
        endpoint: 'https://api.anthropic.com/v1/messages',
        requiresAuth: true,
        capabilities: ['text-generation', 'conversation', 'analysis'],
        config: { model: 'claude-3-opus-20240229' }
      }
    ];

    defaultResources.forEach(resource => {
      this.resources.set(resource.id, resource);
    });
  }

  addAPIKey(apiKey: APIKey): void {
    this.apiKeys.set(apiKey.id, apiKey);
    
    // Auto-link API keys to matching resources
    this.resources.forEach(resource => {
      if (resource.provider === apiKey.provider && !resource.apiKeyId) {
        resource.apiKeyId = apiKey.id;
      }
    });
  }

  findResource(query: ResourceQuery): Resource | null {
    for (const resource of this.resources.values()) {
      if (this.matchesQuery(resource, query)) {
        return resource;
      }
    }
    return null;
  }

  findAllResources(query: ResourceQuery): Resource[] {
    return Array.from(this.resources.values())
      .filter(resource => this.matchesQuery(resource, query));
  }

  private matchesQuery(resource: Resource, query: ResourceQuery): boolean {
    // Check if resource has the required capability
    if (!resource.capabilities.includes(query.capability)) {
      return false;
    }

    // Check type if specified
    if (query.type && resource.type !== query.type) {
      return false;
    }

    // Check provider if specified
    if (query.provider && resource.provider !== query.provider) {
      return false;
    }

    // Check if resource has valid API key if required
    if (resource.requiresAuth && !this.hasValidAPIKey(resource)) {
      return false;
    }

    return true;
  }

  private hasValidAPIKey(resource: Resource): boolean {
    if (!resource.apiKeyId) {
      return false;
    }
    
    const apiKey = this.apiKeys.get(resource.apiKeyId);
    return !!(apiKey && apiKey.value);
  }

  async executeResourceCall(resourceId: string, params: Record<string, unknown>): Promise<AgentResponse> {
    const resource = this.resources.get(resourceId);
    if (!resource) {
      return {
        success: false,
        error: `Resource ${resourceId} not found`
      };
    }

    if (resource.requiresAuth && !this.hasValidAPIKey(resource)) {
      return {
        success: false,
        error: `No valid API key found for ${resource.name}`,
        suggestions: [`Please add a ${resource.provider} API key`]
      };
    }

    try {
      const result = await this.makeAPICall(resource, params);
      return {
        success: true,
        data: result,
        resourceUsed: resource.name
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        resourceUsed: resource.name
      };
    }
  }

  private async makeAPICall(resource: Resource, params: Record<string, unknown>): Promise<Record<string, unknown>> {
    const apiKey = resource.apiKeyId ? this.apiKeys.get(resource.apiKeyId) : null;
    
    if (!resource.endpoint) {
      throw new Error(`No endpoint configured for ${resource.name}`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      if (resource.provider === 'openai') {
        headers['Authorization'] = `Bearer ${apiKey.value}`;
      } else if (resource.provider === 'anthropic') {
        headers['x-api-key'] = apiKey.value;
        headers['anthropic-version'] = '2023-06-01';
      }
    }

    const response = await fetch(resource.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...resource.config,
        ...params
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  getAvailableResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  getConfiguredAPIKeys(): APIKey[] {
    return Array.from(this.apiKeys.values()).map(key => ({
      ...key,
      value: key.value ? '***' : '' // Hide actual key values
    }));
  }

  async autoSelectResource(task: string): Promise<Resource | null> {
    // Smart resource selection based on task description
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('transcrib') || taskLower.includes('speech') || taskLower.includes('audio')) {
      return this.findResource({ capability: 'speech-to-text' });
    }
    
    if (taskLower.includes('voice') || taskLower.includes('speak')) {
      return this.findResource({ capability: 'text-to-speech' });
    }
    
    if (taskLower.includes('chat') || taskLower.includes('conversation') || taskLower.includes('talk')) {
      return this.findResource({ capability: 'conversation' });
    }
    
    if (taskLower.includes('analy') || taskLower.includes('review') || taskLower.includes('examine')) {
      return this.findResource({ capability: 'analysis' });
    }
    
    // Default to text generation
    return this.findResource({ capability: 'text-generation' });
  }
}