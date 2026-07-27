package com.auditad.app.vercel.janitor

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface JanitorDao {
    @Query("SELECT * FROM janitor_reset_logs ORDER BY timestamp DESC")
    fun getAllLogs(): Flow<List<JanitorResetLog>>

    @Insert
    suspend fun insertLog(log: JanitorResetLog)
}
