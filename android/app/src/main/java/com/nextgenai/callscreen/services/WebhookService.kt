package com.nextgenai.callscreen.services

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import androidx.lifecycle.LifecycleService
import androidx.lifecycle.lifecycleScope
import com.nextgenai.callscreen.webhook.WebhookAgent
import com.nextgenai.callscreen.webhook.WebhookEvent
import kotlinx.coroutines.launch
import okhttp3.*
import okio.ByteString
import java.util.concurrent.TimeUnit

/**
 * WebhookService - Background service for handling webhook events
 * 
 * Runs as a background service to maintain connection with webhook backend
 * Processes incoming webhook events and forwards them to the WebhookAgent
 */
class WebhookService : LifecycleService() {
    
    private lateinit var webhookAgent: WebhookAgent
    private var webSocket: WebSocket? = null
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(0, TimeUnit.SECONDS) // No timeout for websocket
        .build()
    
    companion object {
        private const val TAG = "WebhookService"
        private const val WEBSOCKET_URL = "ws://10.0.2.2:3000/ws"
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "WebhookService created")
        
        webhookAgent = WebhookAgent(this)
        
        lifecycleScope.launch {
            initializeWebhookConnection()
        }
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        Log.d(TAG, "WebhookService started")
        
        // Restart service if it gets killed
        return START_STICKY
    }
    
    override fun onBind(intent: Intent): IBinder? {
        super.onBind(intent)
        return null
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "WebhookService destroyed")
        
        webSocket?.close(1000, "Service destroyed")
    }
    
    /**
     * Initialize WebSocket connection to webhook backend
     */
    private suspend fun initializeWebhookConnection() {
        try {
            // First initialize the webhook agent
            if (webhookAgent.initialize()) {
                Log.d(TAG, "WebhookAgent initialized successfully")
                
                // Then establish WebSocket connection for real-time events
                connectWebSocket()
            } else {
                Log.e(TAG, "Failed to initialize WebhookAgent")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error initializing webhook connection", e)
        }
    }
    
    /**
     * Connect to WebSocket for real-time webhook events
     */
    private fun connectWebSocket() {
        val request = Request.Builder()
            .url(WEBSOCKET_URL)
            .build()
        
        val listener = object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                Log.d(TAG, "WebSocket connection opened")
                this@WebhookService.webSocket = webSocket
                
                // Send device registration
                val deviceId = android.provider.Settings.Secure.getString(
                    contentResolver,
                    android.provider.Settings.Secure.ANDROID_ID
                )
                
                webSocket.send("""{
                    "type": "register",
                    "deviceId": "$deviceId",
                    "platform": "android"
                }""")
            }
            
            override fun onMessage(webSocket: WebSocket, text: String) {
                Log.d(TAG, "WebSocket message received: $text")
                
                try {
                    // Parse webhook event from message
                    val event = parseWebhookEvent(text)
                    if (event != null) {
                        webhookAgent.processWebhookEvent(event)
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error processing webhook message", e)
                }
            }
            
            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
                Log.d(TAG, "WebSocket binary message received")
            }
            
            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                Log.d(TAG, "WebSocket closing: $code $reason")
            }
            
            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                Log.d(TAG, "WebSocket closed: $code $reason")
                this@WebhookService.webSocket = null
                
                // Attempt to reconnect after delay
                lifecycleScope.launch {
                    kotlinx.coroutines.delay(5000)
                    connectWebSocket()
                }
            }
            
            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.e(TAG, "WebSocket connection failed", t)
                this@WebhookService.webSocket = null
                
                // Attempt to reconnect after delay
                lifecycleScope.launch {
                    kotlinx.coroutines.delay(5000)
                    connectWebSocket()
                }
            }
        }
        
        client.newWebSocket(request, listener)
    }
    
    /**
     * Parse webhook event from WebSocket message
     */
    private fun parseWebhookEvent(message: String): WebhookEvent? {
        try {
            val json = org.json.JSONObject(message)
            
            if (json.getString("type") == "webhook_event") {
                val eventData = json.getJSONObject("event")
                
                return WebhookEvent(
                    id = eventData.getString("id"),
                    category = eventData.getString("category"),
                    eventType = eventData.getString("eventType"),
                    data = parseJsonToMap(eventData.getJSONObject("data")),
                    timestamp = eventData.getLong("timestamp")
                )
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error parsing webhook event", e)
        }
        
        return null
    }
    
    /**
     * Convert JSONObject to Map
     */
    private fun parseJsonToMap(json: org.json.JSONObject): Map<String, Any> {
        val map = mutableMapOf<String, Any>()
        
        val keys = json.keys()
        while (keys.hasNext()) {
            val key = keys.next()
            map[key] = json.get(key)
        }
        
        return map
    }
}