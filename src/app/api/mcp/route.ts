import { NextRequest, NextResponse } from 'next/server';
import { ResourceManager } from '@/lib/resource-manager';
import { MCPServer } from '@/lib/mcp-server';

// Global instances (in production, these would be properly managed)
const resourceManager = new ResourceManager();
const mcpServer = new MCPServer(resourceManager);

export async function POST(request: NextRequest) {
  try {
    const message = await request.json();
    const response = await mcpServer.handleMessage(message);
    
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

export async function GET() {
  return NextResponse.json({
    name: 'Next GenAI MCP Server',
    version: '1.0.0',
    capabilities: [
      'resources/list',
      'resources/query', 
      'resources/call',
      'agent/auto-select',
      'keys/add',
      'keys/list'
    ],
    status: 'ready'
  });
}