package com.auditad.app.vercel.janitor

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels

class JanitorActivity : ComponentActivity() {
    private val viewModel: JanitorViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            JanitorWorkspaceScreen(viewModel = viewModel)
        }
    }
}
