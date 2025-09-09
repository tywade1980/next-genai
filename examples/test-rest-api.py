#!/usr/bin/env python3

import requests
import json

# Example Python script to test the REST API
API_BASE = 'http://localhost:3000/api'

def test_rest_api():
    print("Testing Next GenAI REST API...\n")
    
    # Test 1: Get all resources
    print("1. Getting all resources:")
    try:
        response = requests.get(f"{API_BASE}/resources")
        result = response.json()
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Query resources by capability
    print("2. Querying resources for speech-to-text:")
    try:
        response = requests.get(f"{API_BASE}/resources?capability=speech-to-text")
        result = response.json()
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Auto-select resource for a task
    print("3. Auto-selecting resource for transcription:")
    try:
        response = requests.post(f"{API_BASE}/agent", json={
            "task": "Transcribe this audio file for customer service",
            "autoExecute": False
        })
        result = response.json()
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 4: Add an API key
    print("4. Adding an API key:")
    try:
        response = requests.post(f"{API_BASE}/keys", json={
            "name": "Python Test Key",
            "value": "sk-python-test-123",
            "provider": "openai",
            "type": "openai"
        })
        result = response.json()
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")
    
    print("\n" + "="*50 + "\n")
    
    # Test 5: List configured keys
    print("5. Listing configured keys:")
    try:
        response = requests.get(f"{API_BASE}/keys")
        result = response.json()
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_rest_api()