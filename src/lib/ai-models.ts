import { OpenAI } from 'openai'
import { prisma } from './database'

export interface AIModelConfig {
  name: string
  type: 'llm' | 'vision' | 'speech'
  provider: string
  modelId: string
  isActive: boolean
  configuration?: Record<string, unknown>
}

export class AIModelManager {
  private static instance: AIModelManager
  private openai: OpenAI | null = null
  private activeModels: Map<string, AIModelConfig> = new Map()

  private constructor() {
    this.initializeOpenAI()
  }

  static getInstance(): AIModelManager {
    if (!AIModelManager.instance) {
      AIModelManager.instance = new AIModelManager()
    }
    return AIModelManager.instance
  }

  private initializeOpenAI() {
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey) {
      this.openai = new OpenAI({ apiKey })
    }
  }

  async loadModels(): Promise<void> {
    try {
      const models = await prisma.aIModel.findMany()

      this.activeModels.clear()
      models.forEach((model: {
        name: string;
        type: string;
        provider: string;
        modelId: string;
        isActive: boolean;
        configuration: unknown;
      }) => {
        this.activeModels.set(model.name, {
          name: model.name,
          type: model.type as 'llm' | 'vision' | 'speech',
          provider: model.provider,
          modelId: model.modelId,
          isActive: model.isActive,
          configuration: model.configuration as Record<string, unknown>
        })
      })

      console.log(`✅ Loaded ${models.length} active AI models`)
    } catch (error) {
      console.error('❌ Error loading AI models:', error)
    }
  }

  async generateResponse(
    prompt: string,
    modelName: string = 'GPT-4 Turbo',
    options?: Record<string, unknown>
  ): Promise<string> {
    const model = this.activeModels.get(modelName)
    if (!model) {
      throw new Error(`Model ${modelName} not found or not active`)
    }

    if (model.provider === 'openai' && this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: model.modelId,
          messages: [{ role: 'user', content: prompt }],
          temperature: (model.configuration?.temperature as number) || 0.7,
          max_tokens: (model.configuration?.max_tokens as number) || 1000,
          ...(options || {})
        })

        return response.choices[0]?.message?.content || 'No response generated'
      } catch (error) {
        console.error('❌ Error generating response:', error)
        return 'Error: Unable to generate response'
      }
    }

    // Fallback for when OpenAI is not available
    return this.generateMockResponse(prompt)
  }

  private generateMockResponse(prompt: string): string {
    // Simple mock responses for different types of construction-related queries
    const responses = {
      project: "Based on the project requirements, I recommend prioritizing structural work first, followed by electrical and plumbing installations. The timeline should account for weather delays and permit approvals.",
      cost: "Current market rates for construction materials have increased by 8% this quarter. Labor costs remain stable at $45-55/hour for skilled trades in this region.",
      safety: "Please ensure all workers have proper PPE and safety training. OSHA compliance requires regular safety meetings and hazard assessments for this type of construction.",
      code: "This project must comply with IBC 2021 standards for structural requirements and NEC 2020 for electrical installations. Local amendments may apply.",
      schedule: "The proposed timeline is realistic given current labor availability and material supply chains. Consider adding 2 weeks buffer for permit processing."
    }

    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('project') || lowerPrompt.includes('task')) {
      return responses.project
    } else if (lowerPrompt.includes('cost') || lowerPrompt.includes('budget') || lowerPrompt.includes('price')) {
      return responses.cost
    } else if (lowerPrompt.includes('safety') || lowerPrompt.includes('hazard')) {
      return responses.safety
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('regulation') || lowerPrompt.includes('compliance')) {
      return responses.code
    } else if (lowerPrompt.includes('schedule') || lowerPrompt.includes('timeline')) {
      return responses.schedule
    }

    return "I understand you're asking about construction management. Could you provide more specific details about your project, timeline, budget, or safety requirements?"
  }

  async analyzeCall(transcript: string): Promise<{
    summary: string
    sentiment: 'positive' | 'neutral' | 'negative'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    actionItems: string[]
  }> {
    const prompt = `Analyze this construction business phone call transcript and provide:
    1. A brief summary
    2. The overall sentiment (positive/neutral/negative)
    3. Priority level (low/normal/high/urgent)
    4. Action items or follow-ups needed

    Transcript: ${transcript}`

    const response = await this.generateResponse(prompt, 'GPT-4 Turbo')

    // Parse the response or provide mock data
    return {
      summary: response.includes('summary') ? response : `Call regarding: ${transcript.slice(0, 100)}...`,
      sentiment: this.determineSentiment(transcript),
      priority: this.determinePriority(transcript),
      actionItems: this.extractActionItems(transcript)
    }
  }

  private determineSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'satisfied', 'happy', 'pleased']
    const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'angry', 'frustrated']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  private determinePriority(text: string): 'low' | 'normal' | 'high' | 'urgent' {
    const urgentWords = ['urgent', 'emergency', 'asap', 'immediately', 'critical']
    const highWords = ['important', 'priority', 'soon', 'deadline']
    
    const lowerText = text.toLowerCase()
    
    if (urgentWords.some(word => lowerText.includes(word))) return 'urgent'
    if (highWords.some(word => lowerText.includes(word))) return 'high'
    return 'normal'
  }

  private extractActionItems(text: string): string[] {
    const actionWords = ['follow up', 'call back', 'send', 'schedule', 'review', 'check']
    const actionItems: string[] = []
    
    const sentences = text.split(/[.!?]+/)
    sentences.forEach(sentence => {
      if (actionWords.some(word => sentence.toLowerCase().includes(word))) {
        actionItems.push(sentence.trim())
      }
    })
    
    return actionItems.length > 0 ? actionItems : ['Follow up on discussion points']
  }

  getActiveModels(): AIModelConfig[] {
    return Array.from(this.activeModels.values())
  }

  async addModel(config: Omit<AIModelConfig, 'id'>): Promise<void> {
    try {
      await prisma.aIModel.create({
        data: {
          name: config.name,
          type: config.type,
          provider: config.provider,
          modelId: config.modelId,
          isActive: config.isActive,
          configuration: config.configuration
        }
      })
      
      if (config.isActive) {
        this.activeModels.set(config.name, config)
      }
    } catch (error) {
      console.error('❌ Error adding AI model:', error)
      throw error
    }
  }
}