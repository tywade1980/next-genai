# Webhook Agent for Android Native App

## Overview

This implementation provides a comprehensive webhook system designed specifically for an **Android native app** with browser connectivity to web and cloud services. The architecture separates concerns between the Android application and a backend webhook service.

## Architecture

### 🏗️ System Components

1. **Android Native App** (Primary Interface)
   - Kotlin-based Android application
   - WebView component for browser functionality
   - Real-time webhook event processing
   - UI for webhook management

2. **Backend Webhook Service** (Node.js)
   - Handles external webhook endpoints
   - WebSocket communication with Android app
   - Event processing and routing
   - Webhook registration and management

3. **Communication Layer**
   - WebSocket for real-time events
   - REST APIs for configuration
   - Authentication and security

## 📱 Android App Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/nextgenai/callscreen/
│   │   │   ├── MainActivity.kt                 # Main app activity
│   │   │   ├── WebhookManagementActivity.kt   # Webhook management UI
│   │   │   ├── webhook/
│   │   │   │   └── WebhookAgent.kt            # Core webhook client
│   │   │   └── services/
│   │   │       └── WebhookService.kt          # Background webhook service
│   │   ├── res/layout/
│   │   │   └── activity_main.xml              # Main UI layout
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── settings.gradle
```

## 🔧 Backend Service Structure

```
webhook-backend/
├── src/
│   ├── server.js                    # Main server with WebSocket
│   ├── routes/
│   │   └── webhooks.js             # Webhook management routes
│   └── services/
│       └── WebhookManager.js       # Webhook logic and storage
└── package.json
```

## 🚀 Key Features

### Android App Features
- **WebView Integration**: Built-in browser for cloud/web connectivity
- **Real-time Events**: WebSocket connection to backend service
- **Webhook Management**: UI for configuring and monitoring webhooks
- **Background Service**: Continuous webhook event processing
- **Call Screen Integration**: Direct integration with call screening functionality

### Backend Service Features
- **Multiple Webhook Endpoints**: Separate endpoints for different app functions
- **WebSocket Communication**: Real-time event broadcasting to Android clients
- **Device Registration**: Track and manage connected Android devices
- **Event History**: Logging and tracking of webhook events
- **RESTful API**: Standard REST endpoints for webhook management

## 📡 Webhook Categories

### 1. Call Screening (`/api/webhooks/call-screening`)
- `call.incoming` - New incoming call detected
- `call.answered` - Call was answered
- `call.ended` - Call has ended

### 2. AI Processing (`/api/webhooks/ai-processing`)
- `ai.request` - AI processing request received
- `ai.response` - AI processing completed
- `ai.error` - AI processing error occurred

### 3. CBMS Integration (`/api/webhooks/cbms-integration`)
- `cbms.update` - Construction business data updated
- `cbms.create` - New CBMS record created
- `cbms.delete` - CBMS record deleted

### 4. Receptionist Dialer (`/api/webhooks/receptionist-dialer`)
- `dialer.outgoing` - Outbound call initiated
- `dialer.connected` - Call successfully connected
- `dialer.failed` - Call attempt failed

## 🔄 Communication Flow

1. **Initialization**:
   - Android app starts and initializes WebhookAgent
   - WebhookService connects to backend via WebSocket
   - Device registration with backend service

2. **Webhook Registration**:
   - Android app requests webhook deployment
   - Backend creates webhook endpoints
   - Configuration stored and synced

3. **Event Processing**:
   - External services send webhook events to backend
   - Backend processes and broadcasts to connected Android devices
   - Android app receives and handles events in real-time

## 🛠️ Setup Instructions

### Backend Service

1. **Install Dependencies**:
   ```bash
   cd webhook-backend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Production Start**:
   ```bash
   npm start
   ```

### Android App

1. **Open in Android Studio**:
   - Import the `android` folder as an Android project
   - Sync Gradle dependencies

2. **Configure Network**:
   - Update IP addresses in `WebhookAgent.kt` for your development environment
   - Ensure Android emulator can reach your backend service

3. **Build and Run**:
   - Build the app in Android Studio
   - Run on device or emulator

## 🌐 Browser Integration

The Android app includes a WebView component that provides:
- Access to cloud dashboards and services
- Web-based configuration interfaces
- Integration with external web applications
- Seamless bridge between native app and web services

## 🔒 Security Considerations

- **Device Authentication**: Each Android device is registered with unique ID
- **Secure WebSocket**: Use WSS in production
- **API Authentication**: Implement proper authentication for webhook endpoints
- **Input Validation**: All webhook data is validated before processing

## 📊 Monitoring and Management

- **Real-time Status**: Live webhook status in Android app
- **Event History**: Track all webhook events and processing
- **Device Management**: Monitor connected Android devices
- **Health Checks**: Backend service health monitoring

## 🎯 Benefits of Android-First Architecture

1. **Native Performance**: Full Android native app performance
2. **Offline Capability**: Core functionality works without internet
3. **System Integration**: Deep integration with Android call management
4. **Real-time Updates**: Instant webhook event processing
5. **Scalable Backend**: Separate backend service can handle multiple devices
6. **Web Connectivity**: WebView provides full browser capabilities when needed

This architecture ensures the webhook system works seamlessly with an Android-first approach while maintaining the flexibility to connect to web and cloud services through the integrated browser component.