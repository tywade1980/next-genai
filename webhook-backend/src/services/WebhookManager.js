class WebhookManager {
    constructor() {
        this.devices = new Map();
        this.webhookConfigs = new Map();
        this.eventHistory = [];
    }
    
    /**
     * Register an Android device
     */
    registerDevice(deviceId, platform, appVersion) {
        const device = {
            deviceId,
            platform,
            appVersion,
            registeredAt: Date.now(),
            lastSeen: Date.now(),
            webhooks: []
        };
        
        this.devices.set(deviceId, device);
        console.log(`Device registered: ${deviceId} (${platform})`);
        
        return device;
    }
    
    /**
     * Update device last seen timestamp
     */
    updateDeviceActivity(deviceId) {
        const device = this.devices.get(deviceId);
        if (device) {
            device.lastSeen = Date.now();
        }
    }
    
    /**
     * Get all registered devices
     */
    getDevices() {
        return Array.from(this.devices.values());
    }
    
    /**
     * Get device by ID
     */
    getDevice(deviceId) {
        return this.devices.get(deviceId);
    }
    
    /**
     * Store webhook configuration
     */
    setWebhookConfig(deviceId, config) {
        if (!this.webhookConfigs.has(deviceId)) {
            this.webhookConfigs.set(deviceId, []);
        }
        
        this.webhookConfigs.get(deviceId).push(config);
        
        // Also update device record
        const device = this.devices.get(deviceId);
        if (device) {
            device.webhooks.push(config);
        }
    }
    
    /**
     * Get webhook configurations for device
     */
    getWebhookConfigs(deviceId) {
        return this.webhookConfigs.get(deviceId) || [];
    }
    
    /**
     * Log webhook event
     */
    logEvent(event) {
        this.eventHistory.push({
            ...event,
            processedAt: Date.now()
        });
        
        // Keep only last 1000 events
        if (this.eventHistory.length > 1000) {
            this.eventHistory = this.eventHistory.slice(-1000);
        }
    }
    
    /**
     * Get event history
     */
    getEventHistory(limit = 100) {
        return this.eventHistory
            .slice(-limit)
            .reverse(); // Most recent first
    }
    
    /**
     * Get statistics
     */
    getStats() {
        return {
            totalDevices: this.devices.size,
            activeDevices: Array.from(this.devices.values())
                .filter(device => Date.now() - device.lastSeen < 5 * 60 * 1000) // Active in last 5 minutes
                .length,
            totalEvents: this.eventHistory.length,
            webhookConfigs: Array.from(this.webhookConfigs.values())
                .reduce((sum, configs) => sum + configs.length, 0)
        };
    }
}

module.exports = { WebhookManager };