package com.nextgenai.callscreen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.nextgenai.callscreen.webhook.WebhookAgent
import com.nextgenai.callscreen.webhook.WebhookConfig
import kotlinx.coroutines.launch

/**
 * WebhookManagementActivity - Manage webhook configurations
 * 
 * Provides interface for viewing and managing active webhooks
 * Displays webhook status, events, and configuration options
 */
class WebhookManagementActivity : AppCompatActivity() {
    
    private lateinit var webhookAgent: WebhookAgent
    private lateinit var recyclerView: RecyclerView
    private lateinit var webhookAdapter: WebhookAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webhook_management)
        
        supportActionBar?.title = "Webhook Management"
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        
        setupRecyclerView()
        initializeWebhookAgent()
        loadWebhooks()
    }
    
    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.rv_webhooks)
        webhookAdapter = WebhookAdapter { webhook ->
            // Handle webhook item click
            showWebhookDetails(webhook)
        }
        
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = webhookAdapter
    }
    
    private fun initializeWebhookAgent() {
        webhookAgent = WebhookAgent(this)
    }
    
    private fun loadWebhooks() {
        lifecycleScope.launch {
            try {
                val webhooks = webhookAgent.getActiveWebhooks()
                webhookAdapter.updateWebhooks(webhooks)
                
                if (webhooks.isEmpty()) {
                    Toast.makeText(
                        this@WebhookManagementActivity,
                        "No active webhooks found",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            } catch (e: Exception) {
                Toast.makeText(
                    this@WebhookManagementActivity,
                    "Failed to load webhooks: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
    
    private fun showWebhookDetails(webhook: WebhookConfig) {
        val details = """
            Name: ${webhook.name}
            URL: ${webhook.url}
            Events: ${webhook.events.joinToString(", ")}
            Status: ${if (webhook.active) "Active" else "Inactive"}
        """.trimIndent()
        
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Webhook Details")
            .setMessage(details)
            .setPositiveButton("OK", null)
            .show()
    }
    
    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}

/**
 * Adapter for webhook list
 */
class WebhookAdapter(
    private val onItemClick: (WebhookConfig) -> Unit
) : RecyclerView.Adapter<WebhookAdapter.WebhookViewHolder>() {
    
    private var webhooks = listOf<WebhookConfig>()
    
    fun updateWebhooks(newWebhooks: List<WebhookConfig>) {
        webhooks = newWebhooks
        notifyDataSetChanged()
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): WebhookViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_webhook, parent, false)
        return WebhookViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: WebhookViewHolder, position: Int) {
        holder.bind(webhooks[position], onItemClick)
    }
    
    override fun getItemCount(): Int = webhooks.size
    
    class WebhookViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nameText: TextView = itemView.findViewById(R.id.tv_webhook_name)
        private val urlText: TextView = itemView.findViewById(R.id.tv_webhook_url)
        private val statusText: TextView = itemView.findViewById(R.id.tv_webhook_status)
        private val eventsText: TextView = itemView.findViewById(R.id.tv_webhook_events)
        
        fun bind(webhook: WebhookConfig, onItemClick: (WebhookConfig) -> Unit) {
            nameText.text = webhook.name
            urlText.text = webhook.url
            statusText.text = if (webhook.active) "Active" else "Inactive"
            statusText.setTextColor(
                if (webhook.active) 
                    ContextCompat.getColor(itemView.context, android.R.color.holo_green_dark)
                else 
                    ContextCompat.getColor(itemView.context, android.R.color.holo_red_dark)
            )
            eventsText.text = "Events: ${webhook.events.size}"
            
            itemView.setOnClickListener { onItemClick(webhook) }
        }
    }
}