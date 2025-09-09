# Next GenAI - Android Native App with Webhook Agent

This is an Android-first smart call screen and receptionist dialer application with AI processing and CBMS (Construction Business Management System) integration.

## Features

- **Android Native App**: Primary interface built with Kotlin
- **Webhook Agent**: Real-time webhook processing and management
- **WebView Integration**: Browser connectivity for web/cloud services
- **Call Screen**: AI-powered call screening and routing
- **AI Processing**: 3 AI models for intelligent call processing
- **CBMS Integration**: Construction business management system connectivity
- **Receptionist Dialer**: Automated dialing and call management

## Architecture

The application uses an Android-first architecture with:

1. **Android Native App** - Primary user interface and call handling
2. **Backend Webhook Service** - Node.js service for webhook processing
3. **WebView Component** - Browser functionality for web/cloud connectivity
4. **Real-time Communication** - WebSocket connection between app and backend

## Quick Start

### Backend Service
```bash
cd webhook-backend
npm install
npm run dev
```

### Android App
1. Open `android/` folder in Android Studio
2. Sync Gradle dependencies
3. Run on device or emulator

## Documentation

See `docs/ANDROID_WEBHOOK_ARCHITECTURE.md` for detailed architecture and setup instructions.

## Webhook Endpoints

- **Call Screening**: `/api/webhooks/call-screening`
- **AI Processing**: `/api/webhooks/ai-processing`
- **CBMS Integration**: `/api/webhooks/cbms-integration`
- **Receptionist Dialer**: `/api/webhooks/receptionist-dialer`

## Development

The webhook agent manages deploying and creating necessary webhooks for all app functions and requests, providing seamless integration between the Android native app and cloud services.
