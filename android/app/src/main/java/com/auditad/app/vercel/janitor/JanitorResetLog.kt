package com.auditad.app.vercel.janitor

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "janitor_reset_logs")
data class JanitorResetLog(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val oldId: String,
    val newId: String,
    val timestamp: Long = System.currentTimeMillis()
)
