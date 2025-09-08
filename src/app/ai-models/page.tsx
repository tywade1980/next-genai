'use client'

import Link from "next/link";
import { useState } from "react";
import { Brain, ArrowLeft, Zap, Settings, Play, Pause, Download, CheckCircle, AlertTriangle } from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  type: 'llm' | 'vision' | 'speech';
  provider: string;
  modelId: string;
  isActive: boolean;
  configuration?: Record<string, unknown>;
  status: 'ready' | 'loading' | 'error' | 'downloading';
}

// Mock data for demonstration
const mockModels: AIModel[] = [
  {
    id: '1',
    name: 'GPT-4 Turbo',
    type: 'llm',
    provider: 'OpenAI',
    modelId: 'gpt-4-turbo-preview',
    isActive: true,
    status: 'ready',
    configuration: {
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
    },
  },
  {
    id: '2',
    name: 'Claude 3 Haiku',
    type: 'llm',
    provider: 'Anthropic',
    modelId: 'claude-3-haiku-20240307',
    isActive: true,
    status: 'ready',
    configuration: {
      temperature: 0.5,
      max_tokens: 1500,
    },
  },
  {
    id: '3',
    name: 'Whisper',
    type: 'speech',
    provider: 'OpenAI',
    modelId: 'whisper-1',
    isActive: true,
    status: 'ready',
    configuration: {
      language: 'en',
    },
  },
  {
    id: '4',
    name: 'GPT-3.5 Turbo',
    type: 'llm',
    provider: 'OpenAI',
    modelId: 'gpt-3.5-turbo',
    isActive: false,
    status: 'ready',
    configuration: {
      temperature: 0.7,
      max_tokens: 1000,
    },
  },
  {
    id: '5',
    name: 'DALL-E 3',
    type: 'vision',
    provider: 'OpenAI',
    modelId: 'dall-e-3',
    isActive: false,
    status: 'downloading',
    configuration: {
      quality: 'standard',
      size: '1024x1024',
    },
  }
];

const typeColors = {
  llm: 'bg-blue-100 text-blue-800',
  vision: 'bg-purple-100 text-purple-800',
  speech: 'bg-green-100 text-green-800',
};

const statusColors = {
  ready: 'text-green-600',
  loading: 'text-yellow-600',
  error: 'text-red-600',
  downloading: 'text-blue-600',
};

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'ready':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'loading':
      return <Zap className="h-4 w-4 text-yellow-600 animate-pulse" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'downloading':
      return <Download className="h-4 w-4 text-blue-600 animate-bounce" />;
    default:
      return <Brain className="h-4 w-4 text-gray-600" />;
  }
};

export default function AIModelsPage() {
  const [models, setModels] = useState<AIModel[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTestingModel, setIsTestingModel] = useState(false);

  const toggleModelStatus = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, isActive: !model.isActive }
        : model
    ));
  };

  const testModel = async () => {
    if (!selectedModel || !testPrompt.trim()) return;
    
    setIsTestingModel(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock response based on model type
      let response = '';
      if (selectedModel.type === 'llm') {
        response = `This is a mock response from ${selectedModel.name}. In a real implementation, this would be the actual AI model response to your prompt: "${testPrompt}"`;
      } else if (selectedModel.type === 'speech') {
        response = `Speech-to-text processing complete. Detected language: English. Confidence: 95%`;
      } else if (selectedModel.type === 'vision') {
        response = `Image analysis complete. No image provided for analysis.`;
      }
      
      setTestResult(response);
      setIsTestingModel(false);
    }, 2000);
  };

  const activeModels = models.filter(m => m.isActive);
  const readyModels = models.filter(m => m.status === 'ready');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">AI Model Management</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">AI Model Management</h2>
          <p className="text-gray-600 mt-2">Manage and configure AI models for call analysis, project insights, and business intelligence</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Models</p>
                <p className="text-2xl font-bold text-gray-900">{models.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-gray-900">{activeModels.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ready Models</p>
                <p className="text-2xl font-bold text-gray-900">{readyModels.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Providers</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(models.map(m => m.provider)).size}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Models List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Available AI Models</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedModel?.id === model.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedModel(model)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{model.name}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeColors[model.type]}`}>
                            {model.type.toUpperCase()}
                          </span>
                          <StatusIcon status={model.status} />
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Provider: {model.provider}</span>
                          <span>Model: {model.modelId}</span>
                          <span className={statusColors[model.status]}>
                            {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModelStatus(model.id);
                          }}
                          className={`p-2 rounded ${
                            model.isActive 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          disabled={model.status !== 'ready'}
                        >
                          {model.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Model Details and Testing Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              {selectedModel ? (
                <div>
                  <div className="flex items-center mb-4">
                    <Brain className="h-6 w-6 text-blue-600" />
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">Model Details</h3>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="text-gray-900">{selectedModel.name}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeColors[selectedModel.type]}`}>
                        {selectedModel.type.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Provider</label>
                      <p className="text-gray-900">{selectedModel.provider}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Model ID</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedModel.modelId}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <div className="flex items-center space-x-2">
                        <StatusIcon status={selectedModel.status} />
                        <span className={statusColors[selectedModel.status]}>
                          {selectedModel.status.charAt(0).toUpperCase() + selectedModel.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {selectedModel.configuration && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Configuration</label>
                        <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                          {Object.entries(selectedModel.configuration).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key}:</span>
                              <span className="text-gray-900">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Model Testing */}
                  {selectedModel.type === 'llm' && selectedModel.status === 'ready' && (
                    <div className="border-t pt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Test Model</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Test Prompt
                          </label>
                          <textarea
                            value={testPrompt}
                            onChange={(e) => setTestPrompt(e.target.value)}
                            placeholder="Enter a test prompt for the AI model..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>

                        <button
                          onClick={testModel}
                          disabled={!testPrompt.trim() || isTestingModel}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isTestingModel ? (
                            <>
                              <Zap className="h-4 w-4 mr-2 animate-pulse" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Test Model
                            </>
                          )}
                        </button>

                        {testResult && (
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              Response
                            </label>
                            <div className="p-3 bg-gray-50 rounded-lg border">
                              <p className="text-sm text-gray-900">{testResult}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p>Select a model to view details and test functionality</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}