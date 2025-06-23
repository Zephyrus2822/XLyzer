import requests
import os

# Replace with your actual API key or load from environment
API_KEY = os.getenv("GEMINI_API_KEY", "your_actual_api_key")

def list_gemini_models():
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={API_KEY}"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        models = response.json().get("models", [])
        for model in models:
            print(f"Name: {model['name']}")
            print(f"  Description: {model.get('description', 'No description')}")
            print(f"  Version: {model.get('version', 'N/A')}")
            print()
    else:
        print(f"❌ Failed to fetch models: {response.status_code} {response.reason}")
        print(response.text)

if __name__ == "__main__":
    list_gemini_models()
