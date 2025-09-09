const request = require('supertest');
const express = require('express');
const { WebhookManager } = require('../src/services/WebhookManager');

// Mock server setup for testing
const app = express();
app.use(express.json());

const webhookManager = new WebhookManager();

app.post('/api/webhook-agent/initialize', (req, res) => {
    const { deviceId, platform, appVersion } = req.body;
    webhookManager.registerDevice(deviceId, platform, appVersion);
    
    res.json({
        success: true,
        message: 'Webhook agent initialized',
        deviceId,
        timestamp: Date.now()
    });
});

app.post('/api/webhooks/call-screening', (req, res) => {
    const event = {
        id: 'test-event-id',
        category: 'call-screening',
        eventType: req.body.eventType || 'call.incoming',
        data: req.body,
        timestamp: Date.now()
    };
    
    webhookManager.logEvent(event);
    res.json({ success: true, eventId: event.id });
});

describe('Webhook Backend API', () => {
    test('should initialize webhook agent', async () => {
        const response = await request(app)
            .post('/api/webhook-agent/initialize')
            .send({
                deviceId: 'test-device-123',
                platform: 'android',
                appVersion: '1.0.0'
            });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.deviceId).toBe('test-device-123');
    });
    
    test('should handle call screening webhook', async () => {
        const response = await request(app)
            .post('/api/webhooks/call-screening')
            .send({
                eventType: 'call.incoming',
                phoneNumber: '+1234567890',
                timestamp: Date.now()
            });
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.eventId).toBeDefined();
    });
    
    test('webhook manager should track devices', () => {
        const device = webhookManager.registerDevice('device-456', 'android', '1.0.0');
        
        expect(device.deviceId).toBe('device-456');
        expect(device.platform).toBe('android');
        
        const devices = webhookManager.getDevices();
        expect(devices.length).toBeGreaterThan(0);
    });
    
    test('webhook manager should log events', () => {
        const event = {
            id: 'test-event',
            category: 'call-screening',
            eventType: 'call.incoming',
            data: { phoneNumber: '+1234567890' },
            timestamp: Date.now()
        };
        
        webhookManager.logEvent(event);
        
        const history = webhookManager.getEventHistory(1);
        expect(history.length).toBe(1);
        expect(history[0].id).toBe('test-event');
    });
    
    test('webhook manager should provide stats', () => {
        const stats = webhookManager.getStats();
        
        expect(stats).toHaveProperty('totalDevices');
        expect(stats).toHaveProperty('activeDevices');
        expect(stats).toHaveProperty('totalEvents');
        expect(stats).toHaveProperty('webhookConfigs');
    });
});