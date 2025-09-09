package com.nextgenai.data.database

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import android.content.Context
import com.nextgenai.cbms.domain.*
import com.nextgenai.data.converters.DateConverter
import com.nextgenai.data.converters.StringListConverter

/**
 * Main Room database for Next Gen AI CBMS
 * Stores all construction business management and telephony data
 */
@Database(
    entities = [
        Project::class,
        Client::class,
        CallLog::class,
        Task::class,
        Estimate::class,
        Material::class,
        ProjectMaterial::class
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(DateConverter::class, StringListConverter::class)
abstract class NextGenAIDatabase : RoomDatabase() {
    
    abstract fun projectDao(): ProjectDao
    abstract fun clientDao(): ClientDao
    abstract fun callLogDao(): CallLogDao
    abstract fun taskDao(): TaskDao
    abstract fun estimateDao(): EstimateDao
    abstract fun materialDao(): MaterialDao
    abstract fun projectMaterialDao(): ProjectMaterialDao

    companion object {
        @Volatile
        private var INSTANCE: NextGenAIDatabase? = null

        fun getDatabase(context: Context): NextGenAIDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    NextGenAIDatabase::class.java,
                    "nextgenai_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}