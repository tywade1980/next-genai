import { NextRequest, NextResponse } from 'next/server';
import { ResourceManager } from '@/lib/resource-manager';

const resourceManager = new ResourceManager();

export async function POST(request: NextRequest) {
  try {
    const { task, autoExecute = false, params = {} }: {
      task?: string;
      autoExecute?: boolean;
      params?: Record<string, unknown>;
    } = await request.json();
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }

    // Auto-select the best resource for this task
    const resource = await resourceManager.autoSelectResource(task);
    
    if (!resource) {
      return NextResponse.json({
        success: false,
        error: 'No suitable resource found for this task',
        suggestions: [
          'Try adding API keys for AI providers',
          'Check if the task description matches available capabilities'
        ]
      });
    }

    const result: Record<string, unknown> = {
      success: true,
      selectedResource: {
        id: resource.id,
        name: resource.name,
        type: resource.type,
        provider: resource.provider,
        capabilities: resource.capabilities
      },
      suggestion: `Selected ${resource.name} for: ${task}`
    };

    // If autoExecute is true, also execute the task
    if (autoExecute) {
      const executeResult = await resourceManager.executeResourceCall(resource.id, params);
      result.execution = executeResult;
    }

    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Invalid request', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 400 }
    );
  }
}