package com.nextgenai.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import dagger.hilt.android.AndroidEntryPoint
import com.nextgenai.presentation.theme.NextGenAITheme

/**
 * Main Activity for Next Gen AI Application
 * Integrates Call Screen, Dialer, AI Models, and Construction Business Management
 */
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            NextGenAITheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    NextGenAIApp(
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun NextGenAIApp(modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        MainContent()
    }
}

@Composable
fun MainContent(modifier: Modifier = Modifier) {
    Text(
        text = "Next Gen AI - Smart Call Screen & Business Management",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun NextGenAIAppPreview() {
    NextGenAITheme {
        NextGenAIApp()
    }
}