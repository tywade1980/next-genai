package com.nextgenai.callscreen.webhook

import android.content.Context
import kotlinx.coroutines.*
import okhttp3.*
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * Webhook Agent for Android Native App
 * 
 * Manages webhook registration, deployment, and communication with backend service
 * Designed for Android-first architecture with browser connectivity
 */
class WebhookAgent(private val context: Context) {
    
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()
    
    private val backendUrl = "https://api.nextgenai.com" // Backend webhook service
    private val localBackendUrl = "http://10.0.2.2:3000" // Local development
    
    // Webhook configurations for different app functions
    private val defaultWebhooks = mapOf(
        "call-screening" to listOf("call.incoming", "call.answered", "call.ended"),
        "ai-processing" to listOf("ai.request", "ai.response", "ai.error"),
        "cbms-integration" to listOf("cbms.update", "cbms.create", "cbms.delete"),
        "receptionist-dialer" to listOf("dialer.outgoing", "dialer.connected", "dialer.failed")
    )
    
    private var isInitialized = false
    private val activeWebhooks = mutableListOf<WebhookConfig>()
    
    /**
     * Initialize the webhook agent
     * Sets up communication with backend service and registers device
     */
    suspend fun initialize(): Boolean = withContext(Dispatchers.IO) {
        try {
            val deviceId = android.provider.Settings.Secure.getString(
                context.contentResolver,
                android.provider.Settings.Secure.ANDROID_ID
            )
            
            val request = Request.Builder()
                .url("$localBackendUrl/api/webhook-agent/initialize")
                .post(RequestBody.create(
                    MediaType.parse("application/json"),
                    JSONObject().apply {
                        put("deviceId", deviceId)
                        put("platform", "android")
                        put("appVersion", "1.0.0")
                    }.toString()
                ))
                .build()
            
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                isInitialized = true
                true
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    /**
     * Deploy webhooks to backend service
     * Creates necessary webhook endpoints for all app functions
     */
    suspend fun deployWebhooks(): Boolean = withContext(Dispatchers.IO) {
        if (!isInitialized) {
            throw IllegalStateException("Webhook agent not initialized")
        }
        
        try {
            defaultWebhooks.forEach { (category, events) ->
                val webhookConfig = WebhookConfig(
                    name = category,
                    url = "$localBackendUrl/api/webhooks/$category",
                    events = events,
                    active = true
                )
                
                if (registerWebhook(webhookConfig)) {
                    activeWebhooks.add(webhookConfig)
                }
            }
            
            activeWebhooks.isNotEmpty()
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    /**
     * Register a webhook with the backend service
     */
    private suspend fun registerWebhook(config: WebhookConfig): Boolean = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$localBackendUrl/api/webhooks/register")
                .post(RequestBody.create(
                    MediaType.parse("application/json"),
                    JSONObject().apply {
                        put("name", config.name)
                        put("url", config.url)
                        put("events", JSONArray(config.events))
                        put("active", config.active)
                    }.toString()
                ))
                .build()
            
            val response = client.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
    
    /**
     * Get list of active webhooks
     */
    suspend fun getActiveWebhooks(): List<WebhookConfig> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$localBackendUrl/api/webhooks")
                .get()
                .build()
            
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val responseBody = response.body()?.string()
                // Parse response and return webhook list
                activeWebhooks.toList()
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }
    
    /**
     * Process incoming webhook event
     * Called by webhook service when events are received
     */
    fun processWebhookEvent(event: WebhookEvent) {
        when (event.category) {
            "call-screening" -> handleCallScreeningEvent(event)
            "ai-processing" -> handleAIProcessingEvent(event)
            "cbms-integration" -> handleCBMSEvent(event)
            "receptionist-dialer" -> handleDialerEvent(event)
        }
    }
    
    private fun handleCallScreeningEvent(event: WebhookEvent) {
        // Handle call screening webhook events
        // Send broadcast or notification to call screen activity
    }
    
    private fun handleAIProcessingEvent(event: WebhookEvent) {
        // Handle AI processing events
        // Update AI model status or results
    }
    
    private fun handleCBMSEvent(event: WebhookEvent) {
        // Handle CBMS integration events
        // Update construction business management data
    }
    
    private fun handleDialerEvent(event: WebhookEvent) {
        // Handle receptionist dialer events
        // Update dialer status or call queue
    }
}

/**
 * Webhook configuration data class
 */
data class WebhookConfig(
    val name: String,
    val url: String,
    val events: List<String>,
    val active: Boolean
)

/**
 * Webhook event data class
 */
data class WebhookEvent(
    val id: String,
    val category: String,
    val eventType: String,
    val data: Map<String, Any>,
    val timestamp: Long
)