const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for webhooks (in production, use a database)
const webhooks = new Map();

// Register a new webhook
router.post('/register', (req, res) => {
    const { name, url, events, active } = req.body;
    
    const webhook = {
        id: uuidv4(),
        name,
        url,
        events: events || [],
        active: active !== false,
        createdAt: Date.now(),
        lastTriggered: null
    };
    
    webhooks.set(webhook.id, webhook);
    
    console.log(`Webhook registered: ${name} - ${url}`);
    
    res.json({
        success: true,
        webhook
    });
});

// Get all webhooks
router.get('/', (req, res) => {
    const allWebhooks = Array.from(webhooks.values());
    
    res.json({
        success: true,
        webhooks: allWebhooks,
        count: allWebhooks.length
    });
});

// Get specific webhook
router.get('/:id', (req, res) => {
    const webhook = webhooks.get(req.params.id);
    
    if (!webhook) {
        return res.status(404).json({
            error: 'Webhook not found'
        });
    }
    
    res.json({
        success: true,
        webhook
    });
});

// Update webhook
router.put('/:id', (req, res) => {
    const webhook = webhooks.get(req.params.id);
    
    if (!webhook) {
        return res.status(404).json({
            error: 'Webhook not found'
        });
    }
    
    const { name, url, events, active } = req.body;
    
    if (name !== undefined) webhook.name = name;
    if (url !== undefined) webhook.url = url;
    if (events !== undefined) webhook.events = events;
    if (active !== undefined) webhook.active = active;
    
    webhook.updatedAt = Date.now();
    
    res.json({
        success: true,
        webhook
    });
});

// Delete webhook
router.delete('/:id', (req, res) => {
    const deleted = webhooks.delete(req.params.id);
    
    if (!deleted) {
        return res.status(404).json({
            error: 'Webhook not found'
        });
    }
    
    res.json({
        success: true,
        message: 'Webhook deleted'
    });
});

// Trigger webhook (for testing)
router.post('/:id/trigger', (req, res) => {
    const webhook = webhooks.get(req.params.id);
    
    if (!webhook) {
        return res.status(404).json({
            error: 'Webhook not found'
        });
    }
    
    if (!webhook.active) {
        return res.status(400).json({
            error: 'Webhook is not active'
        });
    }
    
    // Update last triggered time
    webhook.lastTriggered = Date.now();
    
    console.log(`Webhook triggered: ${webhook.name}`);
    
    res.json({
        success: true,
        message: 'Webhook triggered',
        webhook
    });
});

module.exports = router;