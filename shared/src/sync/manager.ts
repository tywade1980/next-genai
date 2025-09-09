import WebSocket from 'ws';
import { SyncEvent } from '../types';

export type SyncEventHandler = (event: SyncEvent) => void;

export class SyncManager {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, SyncEventHandler[]> = new Map();
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private token: string | null = null;

  constructor(url: string = process.env.WS_URL || 'ws://localhost:3001') {
    this.url = url;
  }

  setToken(token: string) {
    this.token = token;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.token ? `${this.url}?token=${this.token}` : this.url;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('Sync connection established');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const syncEvent: SyncEvent = JSON.parse(event.data.toString());
            this.handleSyncEvent(syncEvent);
          } catch (error) {
            console.error('Failed to parse sync event:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('Sync connection closed');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('Sync connection error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect().catch((error) => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleSyncEvent(event: SyncEvent) {
    const entityHandlers = this.handlers.get(event.entity);
    if (entityHandlers) {
      entityHandlers.forEach(handler => handler(event));
    }

    // Also trigger global handlers
    const globalHandlers = this.handlers.get('*');
    if (globalHandlers) {
      globalHandlers.forEach(handler => handler(event));
    }
  }

  // Subscribe to sync events for a specific entity type
  subscribe(entity: string, handler: SyncEventHandler): () => void {
    if (!this.handlers.has(entity)) {
      this.handlers.set(entity, []);
    }
    this.handlers.get(entity)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(entity);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  // Send a sync event (for local changes that need to be propagated)
  sendEvent(event: Omit<SyncEvent, 'id' | 'timestamp'>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const fullEvent: SyncEvent = {
        ...event,
        id: this.generateId(),
        timestamp: new Date(),
      };
      this.ws.send(JSON.stringify(fullEvent));
    } else {
      console.warn('Cannot send sync event: connection not open');
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const syncManager = new SyncManager();