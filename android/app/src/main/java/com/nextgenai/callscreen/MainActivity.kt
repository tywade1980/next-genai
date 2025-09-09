package com.nextgenai.callscreen

import android.content.Intent
import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.nextgenai.callscreen.databinding.ActivityMainBinding
import com.nextgenai.callscreen.services.WebhookService
import com.nextgenai.callscreen.webhook.WebhookAgent
import kotlinx.coroutines.launch

/**
 * Main Activity for Next GenAI Call Screen and Receptionist Dialer
 * Android-first application with webhook integration and browser functionality
 */
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var webhookAgent: WebhookAgent
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupWebView()
        initializeWebhookAgent()
        setupClickListeners()
    }
    
    private fun setupWebView() {
        with(binding.webView) {
            webViewClient = WebViewClient()
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = true
                allowUniversalAccessFromFileURLs = true
            }
            
            // Load initial dashboard or cloud service interface
            loadUrl("https://dashboard.nextgenai.com")
        }
    }
    
    private fun initializeWebhookAgent() {
        webhookAgent = WebhookAgent(this)
        
        lifecycleScope.launch {
            try {
                webhookAgent.initialize()
                updateWebhookStatus("Initialized")
                Toast.makeText(this@MainActivity, "Webhook Agent Initialized", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                updateWebhookStatus("Error: ${e.message}")
                Toast.makeText(this@MainActivity, "Failed to initialize webhooks", Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun setupClickListeners() {
        binding.btnCallScreen.setOnClickListener {
            startActivity(Intent(this, CallScreenActivity::class.java))
        }
        
        binding.btnWebhookManagement.setOnClickListener {
            startActivity(Intent(this, WebhookManagementActivity::class.java))
        }
        
        binding.btnInitializeWebhooks.setOnClickListener {
            lifecycleScope.launch {
                try {
                    webhookAgent.deployWebhooks()
                    updateWebhookStatus("Deployed")
                    Toast.makeText(this@MainActivity, "Webhooks Deployed Successfully", Toast.LENGTH_SHORT).show()
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Deployment failed: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }
        
        binding.btnRefreshWebhooks.setOnClickListener {
            lifecycleScope.launch {
                val webhooks = webhookAgent.getActiveWebhooks()
                Toast.makeText(this@MainActivity, "Active webhooks: ${webhooks.size}", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun updateWebhookStatus(status: String) {
        binding.tvWebhookStatus.text = "Webhook Status: $status"
    }
    
    override fun onResume() {
        super.onResume()
        // Start webhook service if not running
        startService(Intent(this, WebhookService::class.java))
    }
}