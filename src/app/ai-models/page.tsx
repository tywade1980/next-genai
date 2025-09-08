'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Download, Play, Pause, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { AIModel, ModelStatus } from '@/types';

export default function AIModelsPage() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingModels, setDownloadingModels] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      // Simulate API call to load models
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockModels: AIModel[] = [
        {
          id: '1',
          name: 'GPT-4 Construction Assistant',
          type: 'llm',
          provider: 'openai',
          modelId: 'gpt-4',
          version: '2024.1',
          status: 'active',
          capabilities: ['text-generation', 'construction-advice', 'code-analysis', 'project-planning'],
          configuration: {
            temperature: 0.7,
            maxTokens: 2048,
            systemPrompt: 'You are a construction industry expert assistant.'
          },
          downloadProgress: 100,
          lastUsed: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Construction Call Screener',
          type: 'llm',
          provider: 'openai',
          modelId: 'gpt-3.5-turbo',
          version: '2024.1',
          status: 'active',
          capabilities: ['call-screening', 'intent-classification', 'urgency-detection'],
          configuration: {
            temperature: 0.3,
            maxTokens: 512,
            systemPrompt: 'You are a professional receptionist for a construction company.'
          },
          downloadProgress: 100,
          lastUsed: '2024-01-15T09:45:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T09:45:00Z'
        },
        {
          id: '3',
          name: 'Speech Recognition',
          type: 'speech-to-text',
          provider: 'openai',
          modelId: 'whisper-1',
          status: 'active',
          capabilities: ['speech-transcription', 'real-time-transcription'],
          configuration: {
            language: 'en',
            format: 'json'
          },
          downloadProgress: 100,
          lastUsed: '2024-01-15T11:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T11:00:00Z'
        },
        {
          id: '4',
          name: 'Local Construction LLM',
          type: 'llm',
          provider: 'local',
          modelId: 'construction-llama-7b',
          version: '1.0',
          status: 'inactive',
          capabilities: ['text-generation', 'offline-assistance'],
          downloadUrl: 'https://example.com/model.bin',
          fileSize: 4200000000, // 4.2GB
          downloadProgress: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
      
      setModels(mockModels);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadModel = async (modelId: string) => {
    setDownloadingModels(prev => new Set(prev).add(modelId));
    
    try {
      // Simulate download progress
      const model = models.find(m => m.id === modelId);
      if (model) {
        setModels(prev => prev.map(m => 
          m.id === modelId 
            ? { ...m, status: 'downloading' as ModelStatus, downloadProgress: 0 }
            : m
        ));

        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setModels(prev => prev.map(m => 
            m.id === modelId 
              ? { ...m, downloadProgress: progress }
              : m
          ));
        }

        // Mark as active when complete
        setModels(prev => prev.map(m => 
          m.id === modelId 
            ? { ...m, status: 'active' as ModelStatus, downloadProgress: 100 }
            : m
        ));
      }
    } catch (error) {
      console.error('Download failed:', error);
      setModels(prev => prev.map(m => 
        m.id === modelId 
          ? { ...m, status: 'failed' as ModelStatus }
          : m
      ));
    } finally {
      setDownloadingModels(prev => {
        const next = new Set(prev);
        next.delete(modelId);
        return next;
      });
    }
  };

  const toggleModel = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;

    const newStatus: ModelStatus = model.status === 'active' ? 'inactive' : 'active';
    
    setModels(prev => prev.map(m => 
      m.id === modelId 
        ? { ...m, status: newStatus, lastUsed: newStatus === 'active' ? new Date().toISOString() : m.lastUsed }
        : m
    ));
  };

  const getStatusIcon = (status: ModelStatus, downloadProgress: number) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
        return <Pause className="h-5 w-5 text-gray-400" />;
      case 'downloading':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Pause className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ModelStatus) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'downloading': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI Models...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="mr-4">
                <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-900" />
              </Link>
              <Brain className="h-8 w-8 text-purple-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">AI Models</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {models.filter(m => m.status === 'active').length} of {models.length} models active
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Models</p>
                <p className="text-2xl font-bold text-gray-900">{models.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Models</p>
                <p className="text-2xl font-bold text-gray-900">
                  {models.filter(m => m.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Downloading</p>
                <p className="text-2xl font-bold text-gray-900">
                  {models.filter(m => m.status === 'downloading').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-gray-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Local Models</p>
                <p className="text-2xl font-bold text-gray-900">
                  {models.filter(m => m.provider === 'local').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Models List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Available Models</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {models.map((model) => (
              <div key={model.id} className="px-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {getStatusIcon(model.status, model.downloadProgress)}
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">
                            {model.provider} • {model.type}
                          </span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                            {model.status}
                          </span>
                          {model.version && (
                            <span className="text-sm text-gray-500">v{model.version}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Capabilities */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {model.capabilities?.map((capability, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Download Progress */}
                    {model.status === 'downloading' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Downloading...</span>
                          <span>{model.downloadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${model.downloadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Model Info */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Model ID:</span> {model.modelId}
                      </div>
                      {model.fileSize && (
                        <div>
                          <span className="font-medium">Size:</span> {formatFileSize(model.fileSize)}
                        </div>
                      )}
                      {model.lastUsed && (
                        <div>
                          <span className="font-medium">Last Used:</span> {new Date(model.lastUsed).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 ml-6">
                    {model.status === 'inactive' && model.downloadUrl && (
                      <button
                        onClick={() => handleDownloadModel(model.id)}
                        disabled={downloadingModels.has(model.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    )}
                    
                    {(model.status === 'active' || model.status === 'inactive') && !model.downloadUrl && (
                      <button
                        onClick={() => toggleModel(model.id)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${
                          model.status === 'active'
                            ? 'text-red-600 bg-red-100 hover:bg-red-200'
                            : 'text-green-600 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {model.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </button>
                    )}
                    
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">AI Models Guide</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Model Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>LLM:</strong> Large Language Models for text generation and conversation</li>
                  <li><strong>Speech-to-Text:</strong> Convert voice calls to text transcripts</li>
                  <li><strong>Text-to-Speech:</strong> Generate voice responses from text</li>
                  <li><strong>Classification:</strong> Categorize and analyze content</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Providers</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>OpenAI:</strong> Cloud-based models with high performance</li>
                  <li><strong>Local:</strong> Downloaded models for offline use</li>
                  <li><strong>Anthropic:</strong> Alternative cloud provider for diverse capabilities</li>
                  <li><strong>Custom:</strong> Specialized models trained for construction industry</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}