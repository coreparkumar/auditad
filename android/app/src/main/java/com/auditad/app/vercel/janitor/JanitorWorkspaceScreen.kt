package com.auditad.app.vercel.janitor

import androidx.compose.foundation.BorderStroke
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.text.SimpleDateFormat
import java.util.*

// Slate Cyberpunk Dark Theme Colors
val SlateDarkBackground = Color(0xFF0B0E14)
val SlateCardSurface = Color(0xFF161B22)
val CyberpunkGreen = Color(0xFF10B981)
val LogContainerDark = Color(0xFF0D1117)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun JanitorWorkspaceScreen(viewModel: JanitorViewModel) {
    val advertisingId by viewModel.advertisingId.collectAsStateWithLifecycle()
    val isResetting by viewModel.isResettingAdId.collectAsStateWithLifecycle()
    val activeTutorial by viewModel.activeJanitorTutorial.collectAsStateWithLifecycle()
    val stepIndex by viewModel.janitorStepIndex.collectAsStateWithLifecycle()
    val logs by viewModel.resetHistoryLogs.collectAsStateWithLifecycle()

    var showLaymanDialog by remember { mutableStateOf(false) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = SlateDarkBackground
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // A. Header
            item {
                JanitorHeader(onExplainClick = { showLaymanDialog = true })
            }

            // B. GAID Workspace
            item {
                GaidWorkspace(
                    adId = advertisingId,
                    isResetting = isResetting,
                    onResetClick = { viewModel.resetAdvertisingId() }
                )
            }

            // C. Network Privacy Hardening Tutorials
            item {
                TutorialSelectors(
                    onSelectGoogle = { viewModel.startTutorial("google") },
                    onSelectMeta = { viewModel.startTutorial("meta") }
                )
            }

            // Inline Wizard Overlay (if active)
            if (activeTutorial != null) {
                item {
                    JanitorWizard(
                        type = activeTutorial!!,
                        stepIndex = stepIndex,
                        onClose = { viewModel.closeTutorial() },
                        onPrevious = { viewModel.previousStep() },
                        onNext = {
                            val total = if (activeTutorial == "google") 3 else 3
                            viewModel.nextStep(total)
                        }
                    )
                }
            }

            // D. Activity Logger
            item {
                ActivityLogger(logs = logs)
            }
        }
    }

    if (showLaymanDialog) {
        LaymanExplanationDialog(onDismiss = { showLaymanDialog = false })
    }
}

@Composable
fun JanitorHeader(onExplainClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().border(1.dp, Color.Gray.copy(alpha = 0.2f), RoundedCornerShape(12.dp)),
        colors = CardDefaults.cardColors(containerColor = SlateCardSurface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CleaningServices, contentDescription = null, tint = CyberpunkGreen)
                Spacer(Modifier.width(8.dp))
                Text("ACCOUNT JANITOR WORKSPACE", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
            }
            Spacer(Modifier.height(8.dp))
            Text(
                "Neutralize hardware-bound tracking profiles and harden network privacy controls.",
                color = Color.Gray,
                fontSize = 14.sp
            )
            TextButton(onClick = onExplainClick, modifier = Modifier.padding(top = 8.dp)) {
                Text("What is this in simple terms?", color = CyberpunkGreen)
            }
        }
    }
}

@Composable
fun GaidWorkspace(adId: String, isResetting: Boolean, onResetClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = SlateCardSurface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("GOOGLE ADVERTISING ID (GAID)", color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(8.dp))
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(LogContainerDark, RoundedCornerShape(8.dp))
                    .border(1.dp, Color.DarkGray, RoundedCornerShape(8.dp))
                    .padding(12.dp)
            ) {
                Text(
                    text = adId,
                    color = if (isResetting) Color.Gray else CyberpunkGreen,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 13.sp
                )
            }
            Spacer(Modifier.height(16.dp))
            Button(
                onClick = onResetClick,
                enabled = !isResetting,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CyberpunkGreen, contentColor = Color.Black),
                shape = RoundedCornerShape(8.dp)
            ) {
                if (isResetting) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.Black, strokeWidth = 2.dp)
                    Spacer(Modifier.width(8.dp))
                    Text("GENERATING FRESH TOKEN...", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                } else {
                    Text("WIPE ADVERTISING PROFILE ID", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.height(12.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                var checked by remember { mutableStateOf(false) }
                Switch(
                    checked = checked,
                    onCheckedChange = { checked = it },
                    colors = SwitchDefaults.colors(checkedThumbColor = CyberpunkGreen, checkedTrackColor = CyberpunkGreen.copy(alpha = 0.5f))
                )
                Spacer(Modifier.width(8.dp))
                Text("Auto routine wipe (Monthly)", color = Color.LightGray, fontSize = 14.sp)
            }
        }
    }
}

@Composable
fun TutorialSelectors(onSelectGoogle: () -> Unit, onSelectMeta: () -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("PRIVACY HARDENING TUTORIALS", color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            TutorialCard("Google Ads Controls", Icons.Default.Settings, onSelectGoogle, Modifier.weight(1f))
            TutorialCard("Meta Personalization", Icons.Default.Facebook, onSelectMeta, Modifier.weight(1f))
        }
    }
}

@Composable
fun TutorialCard(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Card(
        onClick = onClick,
        modifier = modifier.height(100.dp),
        colors = CardDefaults.cardColors(containerColor = SlateCardSurface)
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(icon, contentDescription = null, tint = CyberpunkGreen, modifier = Modifier.size(32.dp))
            Spacer(Modifier.height(8.dp))
            Text(title, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun JanitorWizard(type: String, stepIndex: Int, onClose: () -> Unit, onPrevious: () -> Unit, onNext: () -> Unit) {
    val googleSteps = listOf(
        "Open Google Play Services Settings on your device, locate 'Ads', then click on privacy reset controls.",
        "Choose 'Delete advertising ID' to permanently remove your old GAID profile tracking token.",
        "Toggle off 'Personalized Ads' to opt-out of Google's persistent online profiling."
    )
    val metaSteps = listOf(
        "Open your Facebook/Instagram Settings & Privacy, select Accounts Center, and find 'Your Information and Permissions'.",
        "Under 'Your Activity Off-Meta Technologies', select 'Disconnect Future Activity'.",
        "Confirm the setting to stop Meta from binding external app purchases and habits to your profile."
    )
    val steps = if (type == "google") googleSteps else metaSteps
    val title = if (type == "google") "GOOGLE WIZARD" else "META/FB WIZARD"

    Card(
        modifier = Modifier.fillMaxWidth().border(1.dp, CyberpunkGreen.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
        colors = CardDefaults.cardColors(containerColor = SlateCardSurface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text(title, color = CyberpunkGreen, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                IconButton(onClick = onClose) {
                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.Gray)
                }
            }
            Text("Step ${stepIndex + 1} of ${steps.size}", color = Color.Gray, fontSize = 12.sp)
            Spacer(Modifier.height(12.dp))
            Text(steps[stepIndex], color = Color.White, fontSize = 15.sp, minLines = 3)
            Spacer(Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedButton(
                    onClick = onPrevious,
                    enabled = stepIndex > 0,
                    modifier = Modifier.weight(1f),
                    border = BorderStroke(1.dp, if (stepIndex > 0) CyberpunkGreen else Color.DarkGray)
                ) {
                    Text("PREVIOUS", color = if (stepIndex > 0) CyberpunkGreen else Color.DarkGray)
                }
                Button(
                    onClick = onNext,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberpunkGreen, contentColor = Color.Black)
                ) {
                    Text(if (stepIndex == steps.size - 1) "FINISH" else "NEXT STEP")
                }
            }
        }
    }
}

@Composable
fun ActivityLogger(logs: List<JanitorResetLog>) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("REAL-TIME ACTIVITY LOG", color = Color.Gray, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        Card(
            modifier = Modifier.fillMaxWidth().heightIn(max = 300.dp),
            colors = CardDefaults.cardColors(containerColor = SlateCardSurface)
        ) {
            if (logs.isEmpty()) {
                Box(Modifier.fillMaxSize().padding(16.dp), contentAlignment = Alignment.Center) {
                    Text("No reset events recorded.", color = Color.DarkGray, fontSize = 14.sp)
                }
            } else {
                LazyColumn(modifier = Modifier.padding(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(logs) { log ->
                        LogEntry(log)
                    }
                }
            }
        }
    }
}

@Composable
fun LogEntry(log: JanitorResetLog) {
    val sdf = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault())
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = LogContainerDark)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = CyberpunkGreen, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(8.dp))
                Text("PROFILE RESET SUCCESSFUL", color = CyberpunkGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.weight(1f))
                Text(sdf.format(Date(log.timestamp)), color = Color.Gray, fontSize = 11.sp)
            }
            Spacer(Modifier.height(8.dp))
            Text("OLD: ${log.oldId}", color = Color.Gray, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
            Text("NEW: ${log.newId}", color = CyberpunkGreen, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
        }
    }
}

@Composable
fun LaymanExplanationDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("What is this in simple terms?") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                ExplanationItem("What is the ID?", "A digital tracking barcode tattooed on your device.")
                ExplanationItem("What is profiling?", "Persistent accumulation of habits, financial profiling, and political tracking.")
                ExplanationItem("Why reset?", "Peels off the tattooed barcode and replaces it with a completely blank, randomized ID to break active ad coordination.")
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("UNDERSTOOD", color = CyberpunkGreen) }
        },
        containerColor = SlateCardSurface,
        titleContentColor = Color.White,
        textContentColor = Color.LightGray
    )
}

@Composable
fun ExplanationItem(title: String, description: String) {
    Column {
        Text(title, color = CyberpunkGreen, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Text(description, color = Color.White, fontSize = 14.sp)
    }
}
