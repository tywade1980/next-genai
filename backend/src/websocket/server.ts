import WebSocket from 'ws';
import { SyncEvent } from '@next-genai/shared';

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

class WebSocketManager {
  private clients: Set<ExtendedWebSocket> = new Set();

  constructor(private wss: WebSocket.Server) {
    this.setupHeartbeat();
  }

  addClient(ws: ExtendedWebSocket) {
    this.clients.add(ws);
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      this.clients.delete(ws);
    });

    ws.on('message', (data) => {
      try {
        const event: SyncEvent = JSON.parse(data.toString());
        this.broadcastEvent(event, ws);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });
  }

  broadcastEvent(event: SyncEvent, sender?: ExtendedWebSocket) {
    const message = JSON.stringify(event);

    this.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private setupHeartbeat() {
    setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          this.clients.delete(ws);
          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // 30 seconds
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

let wsManager: WebSocketManager;

export function setupWebSocket(wss: WebSocket.Server) {
  wsManager = new WebSocketManager(wss);

  wss.on('connection', (ws: ExtendedWebSocket, req) => {
    console.log('New WebSocket connection');

    // Extract user ID from token (in a real implementation)
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    
    if (token) {
      // In a real implementation, verify the JWT token here
      ws.userId = 'extracted-user-id';
    }

    wsManager.addClient(ws);

    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to sync server',
      timestamp: new Date(),
    }));
  });

  console.log('WebSocket server setup complete');
}

export function broadcastSyncEvent(event: SyncEvent) {
  if (wsManager) {
    wsManager.broadcastEvent(event);
  }
}

export function getWebSocketStats() {
  return {
    connectedClients: wsManager?.getClientCount() || 0,
  };
}