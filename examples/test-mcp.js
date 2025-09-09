#!/usr/bin/env node

// Example script to test the MCP interface
const API_BASE = 'http://localhost:3000/api/mcp';

async function testMCPInterface() {
  console.log('Testing Next GenAI MCP Interface...\n');

  // Test 1: List all resources
  console.log('1. Listing all available resources:');
  const listMessage = {
    id: 'test_1',
    type: 'request',
    method: 'resources/list'
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listMessage)
    });
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Query resources by capability
  console.log('2. Querying resources for text generation:');
  const queryMessage = {
    id: 'test_2',
    type: 'request',
    method: 'resources/query',
    params: {
      capability: 'text-generation',
      provider: 'openai'
    }
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryMessage)
    });
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Auto-select resource for a task
  console.log('3. Auto-selecting resource for email generation:');
  const autoSelectMessage = {
    id: 'test_3',
    type: 'request',
    method: 'agent/auto-select',
    params: {
      task: 'Generate a professional email response to a customer inquiry'
    }
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(autoSelectMessage)
    });
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Add an API key
  console.log('4. Adding an API key:');
  const addKeyMessage = {
    id: 'test_4',
    type: 'request',
    method: 'keys/add',
    params: {
      name: 'Test OpenAI Key',
      value: 'sk-test123456789',
      provider: 'openai',
      type: 'openai'
    }
  };

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addKeyMessage)
    });
    const result = await response.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the tests
if (require.main === module) {
  testMCPInterface().catch(console.error);
}

module.exports = { testMCPInterface };