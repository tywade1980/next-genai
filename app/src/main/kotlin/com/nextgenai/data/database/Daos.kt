package com.nextgenai.data.database

import androidx.room.*
import androidx.lifecycle.LiveData
import kotlinx.coroutines.flow.Flow
import com.nextgenai.cbms.domain.*

/**
 * Data Access Objects for CBMS entities
 * Provides Kotlin-first APIs with Coroutines and Flow support
 */

@Dao
interface ProjectDao {
    @Query("SELECT * FROM projects ORDER BY updatedAt DESC")
    fun getAllProjects(): Flow<List<Project>>

    @Query("SELECT * FROM projects WHERE id = :id")
    suspend fun getProjectById(id: String): Project?

    @Query("SELECT * FROM projects WHERE status = :status")
    fun getProjectsByStatus(status: ProjectStatus): Flow<List<Project>>

    @Query("SELECT * FROM projects WHERE clientId = :clientId")
    fun getProjectsByClient(clientId: String): Flow<List<Project>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: Project)

    @Update
    suspend fun updateProject(project: Project)

    @Delete
    suspend fun deleteProject(project: Project)
}

@Dao
interface ClientDao {
    @Query("SELECT * FROM clients ORDER BY name ASC")
    fun getAllClients(): Flow<List<Client>>

    @Query("SELECT * FROM clients WHERE id = :id")
    suspend fun getClientById(id: String): Client?

    @Query("SELECT * FROM clients WHERE phone = :phone OR email = :email")
    suspend fun findClientByContact(phone: String?, email: String?): Client?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClient(client: Client)

    @Update
    suspend fun updateClient(client: Client)

    @Delete
    suspend fun deleteClient(client: Client)
}

@Dao
interface CallLogDao {
    @Query("SELECT * FROM call_logs ORDER BY timestamp DESC")
    fun getAllCallLogs(): Flow<List<CallLog>>

    @Query("SELECT * FROM call_logs WHERE id = :id")
    suspend fun getCallLogById(id: String): CallLog?

    @Query("SELECT * FROM call_logs WHERE clientId = :clientId ORDER BY timestamp DESC")
    fun getCallLogsByClient(clientId: String): Flow<List<CallLog>>

    @Query("SELECT * FROM call_logs WHERE projectId = :projectId ORDER BY timestamp DESC")
    fun getCallLogsByProject(projectId: String): Flow<List<CallLog>>

    @Query("SELECT * FROM call_logs WHERE followUpRequired = 1")
    fun getCallLogsRequiringFollowUp(): Flow<List<CallLog>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCallLog(callLog: CallLog)

    @Update
    suspend fun updateCallLog(callLog: CallLog)

    @Delete
    suspend fun deleteCallLog(callLog: CallLog)
}

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY dueDate ASC")
    fun getAllTasks(): Flow<List<Task>>

    @Query("SELECT * FROM tasks WHERE id = :id")
    suspend fun getTaskById(id: String): Task?

    @Query("SELECT * FROM tasks WHERE projectId = :projectId ORDER BY dueDate ASC")
    fun getTasksByProject(projectId: String): Flow<List<Task>>

    @Query("SELECT * FROM tasks WHERE assignedTo = :assignedTo AND status != 'COMPLETED' ORDER BY dueDate ASC")
    fun getTasksByAssignee(assignedTo: String): Flow<List<Task>>

    @Query("SELECT * FROM tasks WHERE status = :status ORDER BY dueDate ASC")
    fun getTasksByStatus(status: TaskStatus): Flow<List<Task>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTask(task: Task)

    @Update
    suspend fun updateTask(task: Task)

    @Delete
    suspend fun deleteTask(task: Task)
}

@Dao
interface EstimateDao {
    @Query("SELECT * FROM estimates ORDER BY createdAt DESC")
    fun getAllEstimates(): Flow<List<Estimate>>

    @Query("SELECT * FROM estimates WHERE id = :id")
    suspend fun getEstimateById(id: String): Estimate?

    @Query("SELECT * FROM estimates WHERE projectId = :projectId")
    fun getEstimatesByProject(projectId: String): Flow<List<Estimate>>

    @Query("SELECT * FROM estimates WHERE clientId = :clientId ORDER BY createdAt DESC")
    fun getEstimatesByClient(clientId: String): Flow<List<Estimate>>

    @Query("SELECT * FROM estimates WHERE status = :status")
    fun getEstimatesByStatus(status: EstimateStatus): Flow<List<Estimate>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEstimate(estimate: Estimate)

    @Update
    suspend fun updateEstimate(estimate: Estimate)

    @Delete
    suspend fun deleteEstimate(estimate: Estimate)
}

@Dao
interface MaterialDao {
    @Query("SELECT * FROM materials ORDER BY name ASC")
    fun getAllMaterials(): Flow<List<Material>>

    @Query("SELECT * FROM materials WHERE id = :id")
    suspend fun getMaterialById(id: String): Material?

    @Query("SELECT * FROM materials WHERE category = :category ORDER BY name ASC")
    fun getMaterialsByCategory(category: String): Flow<List<Material>>

    @Query("SELECT * FROM materials WHERE inStock <= reorderLevel")
    fun getMaterialsNeedingReorder(): Flow<List<Material>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMaterial(material: Material)

    @Update
    suspend fun updateMaterial(material: Material)

    @Delete
    suspend fun deleteMaterial(material: Material)
}

@Dao
interface ProjectMaterialDao {
    @Query("SELECT * FROM project_materials WHERE projectId = :projectId")
    fun getMaterialsByProject(projectId: String): Flow<List<ProjectMaterial>>

    @Query("SELECT * FROM project_materials WHERE materialId = :materialId")
    fun getProjectsByMaterial(materialId: String): Flow<List<ProjectMaterial>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProjectMaterial(projectMaterial: ProjectMaterial)

    @Update
    suspend fun updateProjectMaterial(projectMaterial: ProjectMaterial)

    @Delete
    suspend fun deleteProjectMaterial(projectMaterial: ProjectMaterial)
}