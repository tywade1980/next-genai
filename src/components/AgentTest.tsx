'use client';

import { useState } from 'react';

interface AgentTestProps {
  onResourceSelected?: (resource: SelectedResource) => void;
}

interface SelectedResource {
  id: string;
  name: string;
  provider: string;
  type: string;
  capabilities: string[];
}

interface ExecutionResult {
  success: boolean;
  resourceUsed?: string;
  data?: Record<string, unknown>;
  error?: string;
  suggestions?: string[];
}

interface AgentResult {
  success: boolean;
  selectedResource?: SelectedResource;
  suggestion?: string;
  execution?: ExecutionResult;
  error?: string;
  suggestions?: string[];
}

export default function AgentTest({ onResourceSelected }: AgentTestProps) {
  const [task, setTask] = useState('');
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoExecute, setAutoExecute] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: task.trim(),
          autoExecute,
          params: {
            messages: [{ role: 'user', content: task }],
            max_tokens: 100
          }
        })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.selectedResource) {
        onResourceSelected?.(data.selectedResource);
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to process request'
      });
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    'Transcribe this audio file',
    'Generate a professional email response',
    'Analyze this customer feedback',
    'Create a voice message for the receptionist',
    'Chat with a customer about their order'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Smart Agent Test</h2>
      <p className="text-gray-600 mb-4">
        Describe what you want to do, and the agent will automatically select the best resource for the task.
      </p>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Describe what you want to accomplish..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoExecute}
              onChange={(e) => setAutoExecute(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">
              Auto-execute task (requires valid API keys)
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !task.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Processing...' : 'Let Agent Handle It'}
        </button>
      </form>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Try these examples:</div>
        <div className="flex flex-wrap gap-2">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setTask(example)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Agent Response</h3>
          
          {result.success ? (
            <div className="space-y-3">
              {result.selectedResource && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800">Selected Resource</div>
                  <div className="text-sm text-blue-700">
                    <div><strong>Name:</strong> {result.selectedResource.name}</div>
                    <div><strong>Provider:</strong> {result.selectedResource.provider}</div>
                    <div><strong>Type:</strong> {result.selectedResource.type}</div>
                    <div><strong>Capabilities:</strong> {result.selectedResource.capabilities.join(', ')}</div>
                  </div>
                </div>
              )}
              
              {result.suggestion && (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">Suggestion</div>
                  <div className="text-sm text-green-700">{result.suggestion}</div>
                </div>
              )}
              
              {result.execution && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <div className="font-medium text-purple-800">Execution Result</div>
                  <div className="text-sm text-purple-700">
                    {result.execution.success ? (
                      <div>
                        <div>✅ Success!</div>
                        {result.execution.resourceUsed && (
                          <div>Used: {result.execution.resourceUsed}</div>
                        )}
                        {result.execution.data && (
                          <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-32">
                            {JSON.stringify(result.execution.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div>❌ Failed: {result.execution.error}</div>
                        {result.execution.suggestions && (
                          <div className="mt-1">
                            <div>Suggestions:</div>
                            <ul className="list-disc list-inside">
                              {result.execution.suggestions.map((suggestion: string, i: number) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-medium text-red-800">Error</div>
              <div className="text-sm text-red-700">{result.error}</div>
              {result.suggestions && (
                <div className="mt-2">
                  <div>Suggestions:</div>
                  <ul className="list-disc list-inside">
                    {result.suggestions.map((suggestion: string, i: number) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}