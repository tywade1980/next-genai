# Data Linking & Synchronization Protocol

This document outlines the data linking and synchronization mechanisms between the Next GenAI web and mobile applications.

## Overview

The synchronization system ensures that data changes in either the web or mobile application are immediately reflected in the other. This is achieved through a combination of REST APIs, WebSocket connections, and structured event handling.

## Architecture Components

### 1. Shared Data Layer (`@next-genai/shared`)

The shared package provides:
- **Unified Types**: Common TypeScript interfaces for all data models
- **API Client**: Centralized HTTP client with authentication and error handling
- **Sync Manager**: WebSocket-based real-time synchronization
- **Utilities**: Common functions for data validation and formatting

### 2. Backend API (`@next-genai/backend`)

The backend serves as the central data hub:
- **RESTful APIs**: CRUD operations for all data entities
- **WebSocket Server**: Real-time event broadcasting
- **Authentication**: JWT-based user authentication
- **Data Persistence**: Database operations (currently mock data)

### 3. Client Applications

Both web and mobile applications:
- **Use Shared API Client**: Consistent data access patterns
- **Subscribe to Sync Events**: Real-time updates via WebSocket
- **Handle Offline Scenarios**: Local caching and sync on reconnection

## Data Flow

### Initial Data Load
1. Application starts and authenticates user
2. API client fetches initial data via REST endpoints
3. WebSocket connection established for real-time updates
4. Local state populated with fetched data

### Real-time Updates
1. User performs action in any application
2. Change sent to backend via REST API
3. Backend updates data and broadcasts sync event via WebSocket
4. All connected clients receive event and update local state

## Sync Event Structure

```typescript
interface SyncEvent {
  id: string;           // Unique event identifier
  type: 'create' | 'update' | 'delete';  // Operation type
  entity: 'user' | 'call' | 'project' | 'task';  // Data entity
  entityId: string;     // ID of affected entity
  data: any;           // Entity data (for create/update)
  timestamp: Date;     // Event timestamp
  userId: string;      // User who triggered the change
}
```

## Synchronization Scenarios

### Scenario 1: New Call Record Created on Mobile
1. Mobile app creates call record via `POST /calls`
2. Backend stores record and broadcasts sync event:
   ```json
   {
     "type": "create",
     "entity": "call", 
     "entityId": "123",
     "data": { /* call record */ },
     "userId": "user1"
   }
   ```
3. Web app receives event and adds record to local state
4. UI updates automatically to show new call

### Scenario 2: Project Updated on Web
1. Web app updates project via `PUT /projects/456`
2. Backend updates project and broadcasts sync event:
   ```json
   {
     "type": "update",
     "entity": "project",
     "entityId": "456", 
     "data": { /* updated project */ },
     "userId": "user1"
   }
   ```
3. Mobile app receives event and updates local project data
4. Project list refreshes with updated information

### Scenario 3: Task Deleted on Mobile
1. Mobile app deletes task via `DELETE /tasks/789`
2. Backend removes task and broadcasts sync event:
   ```json
   {
     "type": "delete",
     "entity": "task",
     "entityId": "789",
     "userId": "user1"
   }
   ```
3. Web app receives event and removes task from local state
4. Task disappears from UI immediately

## Conflict Resolution

### Last-Write-Wins
- Simple conflict resolution strategy
- Most recent update takes precedence
- Suitable for most business scenarios

### Version Control (Future Enhancement)
- Add version numbers to entities
- Detect conflicts when versions don't match
- Present conflict resolution UI to users

## Offline Handling

### Connection Loss
1. Sync manager detects connection loss
2. Applications continue to function with local data
3. User changes are queued for synchronization
4. Automatic reconnection attempts with exponential backoff

### Reconnection
1. WebSocket connection re-established
2. Applications fetch latest data to detect missed updates
3. Queued local changes are synchronized
4. UI reflects current state

## Error Handling

### API Errors
- Centralized error handling in shared API client
- User-friendly error messages
- Automatic retry for transient failures
- Authentication token refresh

### Sync Errors
- Failed sync events are logged but don't break the application
- Missing events are handled by periodic data refresh
- Connection errors trigger reconnection logic

## Performance Optimizations

### Efficient Updates
- Only changed fields are sent in update events
- Large data sets are paginated
- Debounced updates prevent excessive API calls

### Bandwidth Management
- Events are batched when possible
- Compression used for WebSocket messages
- Only subscribed entity types receive events

### Memory Management
- Local data is garbage collected periodically
- Connection cleanup on application exit
- Event listener cleanup on component unmount

## Security Considerations

### Authentication
- JWT tokens for API authentication
- WebSocket authentication via query parameter
- Automatic token refresh

### Data Validation
- Server-side validation for all data changes
- Client-side validation for user experience
- Sanitization of user inputs

### Access Control
- User-specific data filtering
- Role-based permissions (future enhancement)
- Audit logging of all changes

## Monitoring & Debugging

### Logging
- Structured logging for all sync events
- Error tracking and reporting
- Performance metrics collection

### Debug Tools
- WebSocket connection status indicators
- Sync event logging in development
- API call tracing and timing

## Implementation Example

### Web Application Sync Setup
```typescript
import { syncManager, apiClient } from '@next-genai/shared';

// Initialize sync on app start
useEffect(() => {
  const initSync = async () => {
    await syncManager.connect();
    
    // Subscribe to project updates
    const unsubscribe = syncManager.subscribe('project', (event) => {
      if (event.type === 'update') {
        setProjects(prev => prev.map(p => 
          p.id === event.entityId ? { ...p, ...event.data } : p
        ));
      }
    });
    
    return unsubscribe;
  };
  
  initSync();
}, []);
```

### Mobile Application Sync Setup
```typescript
import { syncManager, apiClient } from '@next-genai/shared';

// React Native sync initialization
useEffect(() => {
  const initializeSync = async () => {
    try {
      await syncManager.connect();
      
      // Global sync handler
      syncManager.subscribe('*', (event) => {
        console.log('Sync event:', event);
        refreshData(); // Refresh relevant data
      });
    } catch (error) {
      console.error('Sync initialization failed:', error);
    }
  };
  
  initializeSync();
  
  return () => {
    syncManager.disconnect();
  };
}, []);
```

This synchronization protocol ensures that users have a consistent experience across all platforms while maintaining data integrity and providing real-time updates.