import { AIModel, AIModelType, AIProvider, ModelStatus } from '@/types';
import { db } from './db';
import { aiModels } from './schema';
import { eq } from 'drizzle-orm';
import { openRouterService } from './openrouter';

export class AIModelManager {
  private static instance: AIModelManager;
  private models: Map<string, unknown> = new Map();

  private constructor() {}

  static getInstance(): AIModelManager {
    if (!AIModelManager.instance) {
      AIModelManager.instance = new AIModelManager();
    }
    return AIModelManager.instance;
  }

  // Initialize default AI models
  async initializeModels(): Promise<void> {
    const defaultModels = [
      {
        name: 'GPT-4 Construction Assistant',
        type: 'llm' as AIModelType,
        provider: 'openai' as AIProvider,
        modelId: 'gpt-4',
        capabilities: ['text-generation', 'construction-advice', 'code-analysis', 'project-planning'],
        configuration: {
          temperature: 0.7,
          maxTokens: 2048,
          systemPrompt: 'You are a construction industry expert assistant specializing in project management, building codes, and cost estimation.'
        }
      },
      {
        name: 'Construction Call Screener',
        type: 'llm' as AIModelType,
        provider: 'openai' as AIProvider,
        modelId: 'gpt-3.5-turbo',
        capabilities: ['call-screening', 'intent-classification', 'urgency-detection'],
        configuration: {
          temperature: 0.3,
          maxTokens: 512,
          systemPrompt: 'You are a professional receptionist for a construction company. Screen calls and categorize them by urgency and intent.'
        }
      },
      {
        name: 'Speech Recognition',
        type: 'speech-to-text' as AIModelType,
        provider: 'openai' as AIProvider,
        modelId: 'whisper-1',
        capabilities: ['speech-transcription', 'real-time-transcription'],
        configuration: {
          language: 'en',
          format: 'json'
        }
      }
    ];

    for (const model of defaultModels) {
      await this.addModel(model);
    }
  }

  // Add a new AI model
  async addModel(modelData: Partial<AIModel>): Promise<string> {
    const existingModel = await db.select()
      .from(aiModels)
      .where(eq(aiModels.modelId, modelData.modelId!))
      .limit(1);

    if (existingModel.length > 0) {
      return existingModel[0].id;
    }

    const result = await db.insert(aiModels).values({
      name: modelData.name!,
      type: modelData.type!,
      provider: modelData.provider!,
      modelId: modelData.modelId!,
      version: modelData.version,
      capabilities: JSON.stringify(modelData.capabilities || []),
      configuration: JSON.stringify(modelData.configuration || {}),
      status: 'inactive' as ModelStatus,
      downloadProgress: 0
    }).returning({ id: aiModels.id });

    return result[0].id;
  }

  // Load a model for use
  async loadModel(modelId: string): Promise<boolean> {
    try {
      const model = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, modelId))
        .limit(1);

      if (model.length === 0) {
        throw new Error('Model not found');
      }

      const modelData = model[0];

      // For API-based models (OpenAI, etc.), just mark as active
      if (modelData.provider !== 'local') {
        await db.update(aiModels)
          .set({ 
            status: 'active' as ModelStatus, 
            lastUsed: new Date().toISOString() 
          })
          .where(eq(aiModels.id, modelId));

        // Store model configuration for use
        this.models.set(modelId, {
          ...modelData,
          configuration: JSON.parse(modelData.configuration || '{}')
        });

        return true;
      }

      // For local models, implement download logic
      if (modelData.downloadUrl && modelData.status !== 'active') {
        await this.downloadModel(modelId, modelData.downloadUrl);
      }

      return true;
    } catch (error) {
      console.error('Failed to load model:', error);
      return false;
    }
  }

  // Download model for local use
  private async downloadModel(modelId: string, downloadUrl: string): Promise<void> {
    await db.update(aiModels)
      .set({ status: 'downloading' as ModelStatus })
      .where(eq(aiModels.id, modelId));

    try {
      // Simulate download progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await db.update(aiModels)
          .set({ downloadProgress: progress })
          .where(eq(aiModels.id, modelId));
        
        // Simulate download time
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await db.update(aiModels)
        .set({ 
          status: 'active' as ModelStatus,
          downloadProgress: 100 
        })
        .where(eq(aiModels.id, modelId));

    } catch (error) {
      await db.update(aiModels)
        .set({ status: 'failed' as ModelStatus })
        .where(eq(aiModels.id, modelId));
      
      throw error;
    }
  }

  // Get all available models
  async getModels(): Promise<AIModel[]> {
    const models = await db.select().from(aiModels);
    return models.map(model => ({
      ...model,
      capabilities: JSON.parse(model.capabilities || '[]'),
      configuration: JSON.parse(model.configuration || '{}'),
      followUpRequired: !!model.downloadProgress
    })) as unknown as AIModel[];
  }

  // Get active models by type
  async getActiveModelsByType(type: AIModelType): Promise<AIModel[]> {
    const models = await db.select()
      .from(aiModels)
      .where(eq(aiModels.type, type));

    return models
      .filter(model => model.status === 'active')
      .map(model => ({
        ...model,
        capabilities: JSON.parse(model.capabilities || '[]'),
        configuration: JSON.parse(model.configuration || '{}'),
        followUpRequired: false
      })) as unknown as AIModel[];
  }

  // Execute AI request
  async executeRequest(modelId: string, prompt: string, options?: Record<string, unknown>): Promise<string> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error('Model not loaded');
    }

    const modelData = model as { type: string; provider: string; modelId: string };
    
    // Handle OpenRouter models
    if (modelData.provider === 'openrouter') {
      try {
        return await openRouterService.generateResponse(modelData.modelId, prompt, options);
      } catch (error) {
        console.error('OpenRouter request failed:', error);
        // Fallback to mock response
        return this.generateLLMResponse(model, prompt, options);
      }
    }
    
    // For demo purposes, return mock responses based on the model type
    switch (modelData.type) {
      case 'llm':
        return this.generateLLMResponse(model, prompt, options);
      case 'speech-to-text':
        return this.transcribeAudio(model, prompt, options);
      default:
        throw new Error('Unsupported model type');
    }
  }

  // Update model status
  async updateModelStatus(modelId: string, status: ModelStatus): Promise<void> {
    await db.update(aiModels)
      .set({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .where(eq(aiModels.id, modelId));
  }

  private async generateLLMResponse(model: unknown, prompt: string, options?: Record<string, unknown>): Promise<string> {
    // In a real implementation, this would call the actual AI service
    const modelData = model as { configuration: Record<string, unknown>; modelId: string; name: string };
    
    if (modelData.modelId.includes('call-screener') || modelData.name.includes('Call Screener')) {
      return JSON.stringify({
        intent: 'project_inquiry',
        urgency: 'medium',
        category: 'new_business',
        confidence: 0.85,
        suggestedAction: 'Schedule consultation',
        keyTopics: ['kitchen renovation', 'budget discussion', 'timeline']
      });
    }

    return `Based on my construction expertise: ${prompt.substring(0, 100)}... [AI Response would be generated here using ${modelData.modelId}]`;
  }

  private async transcribeAudio(model: unknown, audioData: string, options?: Record<string, unknown>): Promise<string> {
    // Mock transcription response
    return "Hello, I'm interested in getting a quote for a kitchen renovation project. The space is about 200 square feet and I'm looking to update everything including cabinets, countertops, and appliances.";
  }

  // Sync OpenRouter models
  async syncOpenRouterModels(): Promise<number> {
    if (!openRouterService.isConfigured()) {
      console.log('OpenRouter API key not configured, skipping model sync');
      return 0;
    }

    try {
      const openRouterModels = await openRouterService.getAvailableModels();
      let addedCount = 0;

      for (const orModel of openRouterModels) {
        const aiModelData = openRouterService.convertToAIModel(orModel);
        
        // Check if model already exists
        const existingModel = await db.select()
          .from(aiModels)
          .where(eq(aiModels.modelId, aiModelData.modelId!))
          .limit(1);

        if (existingModel.length === 0) {
          await this.addModel(aiModelData);
          addedCount++;
        }
      }

      console.log(`Synced ${addedCount} new OpenRouter models`);
      return addedCount;
    } catch (error) {
      console.error('Error syncing OpenRouter models:', error);
      throw error;
    }
  }

  // Get available OpenRouter models (without adding to database)
  async getOpenRouterModels(): Promise<AIModel[]> {
    if (!openRouterService.isConfigured()) {
      return [];
    }

    try {
      const openRouterModels = await openRouterService.getAvailableModels();
      return openRouterModels.map(orModel => {
        const aiModelData = openRouterService.convertToAIModel(orModel);
        return {
          id: `openrouter-${orModel.id}`,
          name: aiModelData.name!,
          type: aiModelData.type!,
          provider: 'openrouter',
          modelId: aiModelData.modelId!,
          version: undefined,
          status: 'inactive' as ModelStatus,
          capabilities: aiModelData.capabilities,
          configuration: aiModelData.configuration,
          downloadProgress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as AIModel;
      });
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      return [];
    }
  }
}