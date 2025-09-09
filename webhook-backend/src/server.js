const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const webhookRoutes = require('./routes/webhooks');
const { WebhookManager } = require('./services/WebhookManager');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize webhook manager
const webhookManager = new WebhookManager();

// Store connected Android clients
const androidClients = new Map();

// WebSocket connection handler
wss.on('connection', (ws, req) => {
    console.log('WebSocket connection established');
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'register' && data.platform === 'android') {
                androidClients.set(data.deviceId, ws);
                console.log(`Android device registered: ${data.deviceId}`);
                
                ws.send(JSON.stringify({
                    type: 'registration_success',
                    deviceId: data.deviceId
                }));
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    });
    
    ws.on('close', () => {
        // Remove client from registry
        for (const [deviceId, client] of androidClients.entries()) {
            if (client === ws) {
                androidClients.delete(deviceId);
                console.log(`Android device disconnected: ${deviceId}`);
                break;
            }
        }
    });
});

// Webhook agent initialization endpoint
app.post('/api/webhook-agent/initialize', (req, res) => {
    const { deviceId, platform, appVersion } = req.body;
    
    console.log(`Webhook agent initialized for device: ${deviceId}`);
    
    // Register device with webhook manager
    webhookManager.registerDevice(deviceId, platform, appVersion);
    
    res.json({
        success: true,
        message: 'Webhook agent initialized',
        deviceId,
        timestamp: Date.now()
    });
});

// Webhook management routes
app.use('/api/webhooks', webhookRoutes);

// Call screening webhook endpoint
app.post('/api/webhooks/call-screening', (req, res) => {
    const event = {
        id: uuidv4(),
        category: 'call-screening',
        eventType: req.body.eventType || 'call.incoming',
        data: req.body,
        timestamp: Date.now()
    };
    
    console.log('Call screening webhook received:', event);
    broadcastToAndroidClients(event);
    
    res.json({ success: true, eventId: event.id });
});

// AI processing webhook endpoint
app.post('/api/webhooks/ai-processing', (req, res) => {
    const event = {
        id: uuidv4(),
        category: 'ai-processing',
        eventType: req.body.eventType || 'ai.request',
        data: req.body,
        timestamp: Date.now()
    };
    
    console.log('AI processing webhook received:', event);
    broadcastToAndroidClients(event);
    
    res.json({ success: true, eventId: event.id });
});

// CBMS integration webhook endpoint
app.post('/api/webhooks/cbms-integration', (req, res) => {
    const event = {
        id: uuidv4(),
        category: 'cbms-integration',
        eventType: req.body.eventType || 'cbms.update',
        data: req.body,
        timestamp: Date.now()
    };
    
    console.log('CBMS integration webhook received:', event);
    broadcastToAndroidClients(event);
    
    res.json({ success: true, eventId: event.id });
});

// Receptionist dialer webhook endpoint
app.post('/api/webhooks/receptionist-dialer', (req, res) => {
    const event = {
        id: uuidv4(),
        category: 'receptionist-dialer',
        eventType: req.body.eventType || 'dialer.outgoing',
        data: req.body,
        timestamp: Date.now()
    };
    
    console.log('Receptionist dialer webhook received:', event);
    broadcastToAndroidClients(event);
    
    res.json({ success: true, eventId: event.id });
});

// Broadcast webhook event to all connected Android clients
function broadcastToAndroidClients(event) {
    const message = JSON.stringify({
        type: 'webhook_event',
        event
    });
    
    androidClients.forEach((client, deviceId) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
            console.log(`Event sent to device: ${deviceId}`);
        }
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        connectedClients: androidClients.size,
        timestamp: Date.now()
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Webhook backend server running on port ${PORT}`);
    console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
});