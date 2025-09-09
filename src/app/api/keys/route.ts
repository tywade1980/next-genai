import { NextRequest, NextResponse } from 'next/server';
import { ResourceManager } from '@/lib/resource-manager';

const resourceManager = new ResourceManager();

export async function GET() {
  const keys = resourceManager.getConfiguredAPIKeys();
  return NextResponse.json({ keys });
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = await request.json();
    
    if (!apiKey.name || !apiKey.value || !apiKey.provider || !apiKey.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, value, provider, type' },
        { status: 400 }
      );
    }

    resourceManager.addAPIKey({
      id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...apiKey,
      lastValidated: new Date()
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `API key for ${apiKey.provider} added successfully` 
    });
    
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