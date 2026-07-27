package com.auditad.app.vercel.janitor

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class JanitorViewModel(application: Application) : AndroidViewModel(application) {
    private val dao = JanitorDatabase.getDatabase(application).janitorDao()

    private val _advertisingId = MutableStateFlow(UUID.randomUUID().toString())
    val advertisingId: StateFlow<String> = _advertisingId.asStateFlow()

    private val _isResettingAdId = MutableStateFlow(false)
    val isResettingAdId: StateFlow<Boolean> = _isResettingAdId.asStateFlow()

    private val _activeJanitorTutorial = MutableStateFlow<String?>(null)
    val activeJanitorTutorial: StateFlow<String?> = _activeJanitorTutorial.asStateFlow()

    private val _janitorStepIndex = MutableStateFlow(0)
    val janitorStepIndex: StateFlow<Int> = _janitorStepIndex.asStateFlow()

    val resetHistoryLogs: StateFlow<List<JanitorResetLog>> = dao.getAllLogs()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun resetAdvertisingId() {
        viewModelScope.launch {
            _isResettingAdId.value = true
            val oldId = _advertisingId.value
            delay(1500)
            val newId = UUID.randomUUID().toString()
            _advertisingId.value = newId
            dao.insertLog(JanitorResetLog(oldId = oldId, newId = newId))
            _isResettingAdId.value = false
        }
    }

    fun startTutorial(type: String) {
        _activeJanitorTutorial.value = type
        _janitorStepIndex.value = 0
    }

    fun closeTutorial() {
        _activeJanitorTutorial.value = null
    }

    fun nextStep(totalSteps: Int) {
        if (_janitorStepIndex.value < totalSteps - 1) {
            _janitorStepIndex.value += 1
        } else {
            closeTutorial()
        }
    }

    fun previousStep() {
        if (_janitorStepIndex.value > 0) {
            _janitorStepIndex.value -= 1
        }
    }
}
