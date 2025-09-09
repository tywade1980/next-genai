# Next GenAI - Intelligent Resource Management System

A smart call screen and receptionist dialer with AI models and CBMS (Construction Business Management Solution).

## Features

### 🤖 Intelligent Agent
- **Auto-Resource Selection**: Simply describe what you want to do, and the agent automatically selects the best AI resource
- **Natural Language Interface**: No need to know which API to call - just describe your task
- **Automatic Execution**: With valid API keys, tasks execute automatically

### 🔑 Simple Key Management
- **Copy & Paste**: Just copy your API keys to the correct boxes
- **Auto-Configuration**: Keys are automatically linked to compatible resources
- **Secure Storage**: Keys are stored securely and never displayed in full

### ⚡ Resource Management
- **Multiple AI Providers**: Support for OpenAI, Anthropic, Google, Azure, and custom providers
- **Capability-Based Routing**: Resources are selected based on their capabilities
- **Real-time Status**: See which resources are ready to use

### 🌐 API & MCP Interface
- **RESTful API**: Standard HTTP endpoints for all functionality
- **MCP Protocol**: Model Context Protocol support for advanced integrations
- **Webhook Ready**: Easy integration with external systems

## Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Add your API keys**:
   - Go to the "API Keys" tab
   - Click "Add Key"
   - Paste your API key and select the provider
   - The system automatically configures resources

3. **Test the agent**:
   - Go to the "Smart Agent" tab
   - Describe what you want to do (e.g., "Transcribe this audio file")
   - The agent selects the best resource and executes if possible

## API Endpoints

### MCP Interface
- `GET /api/mcp` - MCP server status and capabilities
- `POST /api/mcp` - Send MCP messages

### Resource Management
- `GET /api/resources` - List all resources
- `GET /api/resources?capability=text-generation` - Query by capability
- `POST /api/resources` - Execute resource call

### Agent Interface
- `POST /api/agent` - Auto-select and optionally execute task

### Key Management
- `GET /api/keys` - List configured keys (values hidden)
- `POST /api/keys` - Add new API key

## MCP Protocol Examples

### List Resources
```json
{
  "id": "req_1",
  "type": "request",
  "method": "resources/list"
}
```

### Query Resources by Capability
```json
{
  "id": "req_2", 
  "type": "request",
  "method": "resources/query",
  "params": {
    "capability": "text-generation",
    "provider": "openai"
  }
}
```

### Auto-Select Resource
```json
{
  "id": "req_3",
  "type": "request", 
  "method": "agent/auto-select",
  "params": {
    "task": "Generate a professional email response"
  }
}
```

## Supported AI Providers

### OpenAI
- **Models**: GPT-4, GPT-3.5, Whisper, TTS
- **Capabilities**: Text generation, conversation, speech-to-text, text-to-speech
- **Key Format**: `sk-...`

### Anthropic
- **Models**: Claude 3 Opus, Sonnet, Haiku
- **Capabilities**: Text generation, conversation, analysis
- **Key Format**: `sk-ant-...`

### Google
- **Models**: Gemini Pro, Palm
- **Capabilities**: Text generation, analysis
- **Key Format**: Various formats

### Azure OpenAI
- **Models**: GPT-4, GPT-3.5 (Azure hosted)
- **Capabilities**: Text generation, conversation
- **Key Format**: Azure subscription key

## Example Use Cases

### Smart Receptionist
```javascript
// Auto-transcribe incoming calls
const result = await fetch('/api/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'Transcribe this phone call audio',
    autoExecute: true,
    params: { audio: audioFile }
  })
});
```

### Business Management
```javascript
// Analyze customer feedback
const result = await fetch('/api/agent', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'Analyze this customer feedback for sentiment and issues',
    autoExecute: true,
    params: { 
      messages: [{ role: 'user', content: feedbackText }]
    }
  })
});
```

### Construction Management
```javascript
// Generate project reports
const result = await fetch('/api/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'Create a construction project status report',
    autoExecute: true,
    params: {
      messages: [{ 
        role: 'user', 
        content: `Generate a report for: ${projectData}` 
      }]
    }
  })
});
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend UI   │────│   API Routes     │────│ Resource Manager│
│                 │    │                  │    │                 │
│ - Key Manager   │    │ /api/mcp        │    │ - Auto Selection│
│ - Agent Test    │    │ /api/resources  │    │ - API Calls     │
│ - Resource View │    │ /api/agent      │    │ - Config Mgmt   │
└─────────────────┘    │ /api/keys       │    └─────────────────┘
                       └──────────────────┘              │
                                                         │
                       ┌──────────────────┐              │
                       │   MCP Server     │──────────────┘
                       │                  │
                       │ - Message Router │
                       │ - Protocol Impl  │
                       └──────────────────┘
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.