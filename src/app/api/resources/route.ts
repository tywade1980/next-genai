import { NextRequest, NextResponse } from 'next/server';
import { ResourceManager } from '@/lib/resource-manager';

const resourceManager = new ResourceManager();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const capability = searchParams.get('capability');
  const type = searchParams.get('type');
  const provider = searchParams.get('provider');

  if (capability) {
    // Query resources by capability
    const resources = resourceManager.findAllResources({
      capability,
      type: type || undefined,
      provider: provider || undefined
    });
    
    return NextResponse.json({ resources });
  }

  // Return all resources
  const resources = resourceManager.getAvailableResources();
  return NextResponse.json({ resources });
}

export async function POST(request: NextRequest) {
  try {
    const { resourceId, params } = await request.json();
    
    if (!resourceId) {
      return NextResponse.json(
        { error: 'resourceId is required' },
        { status: 400 }
      );
    }

    const response = await resourceManager.executeResourceCall(resourceId, params);
    return NextResponse.json(response);
    
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