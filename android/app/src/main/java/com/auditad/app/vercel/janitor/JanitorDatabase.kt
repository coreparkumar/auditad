package com.auditad.app.vercel.janitor

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [JanitorResetLog::class], version = 1, exportSchema = false)
abstract class JanitorDatabase : RoomDatabase() {
    abstract fun janitorDao(): JanitorDao

    companion object {
        @Volatile
        private var INSTANCE: JanitorDatabase? = null

        fun getDatabase(context: Context): JanitorDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    JanitorDatabase::class.java,
                    "janitor_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
