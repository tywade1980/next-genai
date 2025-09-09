# Next GenAI - Cross-Platform Smart Call Screen & CBMS

A comprehensive solution for smart call screening, receptionist dialing, and construction business management, featuring both web and mobile applications with real-time data synchronization.

## Architecture Overview

```
next-genai/
├── web/                 # Next.js web application
├── mobile/              # React Native mobile application
├── backend/             # Node.js/Express API server
├── shared/              # Shared utilities, types, and API clients
└── docs/                # Documentation
```

## Features

- **Smart Call Screen**: AI-powered call management with 3 AI models (GPT-4, Claude-3, Gemini-Pro)
- **Receptionist Dialer**: Automated dialing and call handling
- **CBMS Integration**: Construction Business Management Solution
- **Real-time Sync**: WebSocket-based synchronization between web and mobile
- **Cross-platform**: Unified experience across web browsers and Android APK

## Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- For mobile development: Android Studio with Android SDK
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tywade1980/next-genai.git
cd next-genai
```

2. Install dependencies:
```bash
npm install
```

3. Install workspace dependencies:
```bash
npm run build:shared
cd web && npm install
cd ../mobile && npm install
cd ../backend && npm install
```

### Development

Start all services in development mode:
```bash
npm run dev
```

Or start individual services:
```bash
# Backend API server
npm run dev:backend

# Web application  
npm run dev:web

# Mobile application
npm run dev:mobile
```

### Building

Build all applications:
```bash
npm run build
```

Build individual applications:
```bash
npm run build:web      # Web production build
npm run build:mobile   # Android APK build
npm run build:backend  # Backend production build
```

## Data Synchronization

The applications use a multi-layered synchronization approach:

### 1. Shared API Client
- Centralized API communication via `@next-genai/shared` package
- Consistent data models and types across platforms
- Automatic token management and error handling

### 2. WebSocket Sync Manager
- Real-time bidirectional communication
- Event-based updates for data changes
- Automatic reconnection with exponential backoff
- Platform-agnostic event handling

### 3. Update Protocols
- Semantic versioning for application updates
- Platform-specific update checking
- Forced update capability for critical releases
- Automatic download links for mobile APK updates

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users/me` - Get current user profile

### Call Records
- `GET /calls` - Get paginated call records
- `POST /calls` - Create new call record

### CBMS Projects
- `GET /projects` - Get paginated projects
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project

### Tasks
- `GET /tasks` - Get tasks (optionally filtered by project)
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task

### Updates
- `POST /updates/check` - Check for application updates

## WebSocket Events

The sync system uses structured events for real-time updates:

```typescript
interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'user' | 'call' | 'project' | 'task';
  entityId: string;
  data: any;
  timestamp: Date;
  userId: string;
}
```

## Environment Configuration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
API_BASE_URL=http://localhost:3001
WS_URL=ws://localhost:3001
ALLOWED_ORIGINS=http://localhost:3000
```

### Web (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

### Mobile
Configuration is managed through the shared package and can be overridden via environment variables.

## Deployment

### Web Application
The Next.js web application can be deployed to Vercel, Netlify, or any static hosting service:

```bash
cd web
npm run build
npm run start
```

### Mobile Application
Build and distribute the Android APK:

```bash
cd mobile
npm run build:android
```

The APK will be generated in `mobile/android/app/build/outputs/apk/release/`.

### Backend API
Deploy the Node.js backend to any cloud provider:

```bash
cd backend
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.