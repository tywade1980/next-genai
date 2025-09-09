package com.nextgenai.cbms.domain

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters
import com.nextgenai.data.converters.DateConverter
import com.nextgenai.data.converters.StringListConverter
import java.util.Date

/**
 * Construction Business Management Solution - Domain Models
 * Core entities for managing construction projects, clients, and business operations
 */

@Entity(tableName = "projects")
@TypeConverters(DateConverter::class, StringListConverter::class)
data class Project(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val clientId: String,
    val status: ProjectStatus,
    val startDate: Date,
    val estimatedEndDate: Date,
    val actualEndDate: Date? = null,
    val budget: Double,
    val actualCost: Double = 0.0,
    val location: String,
    val projectManager: String,
    val tags: List<String> = emptyList(),
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "clients")
data class Client(
    @PrimaryKey val id: String,
    val name: String,
    val email: String?,
    val phone: String?,
    val address: String?,
    val company: String?,
    val notes: String? = null,
    val preferredContactMethod: ContactMethod = ContactMethod.PHONE,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "call_logs")
@TypeConverters(DateConverter::class, StringListConverter::class)
data class CallLog(
    @PrimaryKey val id: String,
    val phoneNumber: String,
    val clientId: String? = null,
    val projectId: String? = null,
    val callType: CallType,
    val duration: Long, // in milliseconds
    val timestamp: Date,
    val transcript: String? = null,
    val summary: String? = null,
    val actionItems: List<String> = emptyList(),
    val sentiment: String? = null,
    val isImportant: Boolean = false,
    val followUpRequired: Boolean = false,
    val followUpDate: Date? = null
)

@Entity(tableName = "tasks")
@TypeConverters(DateConverter::class)
data class Task(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val projectId: String? = null,
    val assignedTo: String,
    val status: TaskStatus = TaskStatus.TODO,
    val priority: Priority = Priority.MEDIUM,
    val dueDate: Date? = null,
    val completedAt: Date? = null,
    val estimatedHours: Double? = null,
    val actualHours: Double? = null,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "estimates")
@TypeConverters(DateConverter::class, StringListConverter::class)
data class Estimate(
    @PrimaryKey val id: String,
    val projectId: String,
    val clientId: String,
    val totalAmount: Double,
    val itemizedCosts: List<String>, // JSON string of cost items
    val validUntil: Date,
    val status: EstimateStatus = EstimateStatus.DRAFT,
    val notes: String? = null,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
)

@Entity(tableName = "materials")
data class Material(
    @PrimaryKey val id: String,
    val name: String,
    val description: String,
    val unit: String, // e.g., "sq ft", "linear ft", "each"
    val costPerUnit: Double,
    val supplier: String? = null,
    val category: String,
    val inStock: Int = 0,
    val reorderLevel: Int = 0
)

@Entity(tableName = "project_materials")
data class ProjectMaterial(
    @PrimaryKey val id: String,
    val projectId: String,
    val materialId: String,
    val quantityNeeded: Double,
    val quantityUsed: Double = 0.0,
    val estimatedCost: Double,
    val actualCost: Double = 0.0,
    val orderDate: Date? = null,
    val deliveryDate: Date? = null
)

// Enums
enum class ProjectStatus {
    PLANNING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED
}

enum class ContactMethod {
    PHONE, EMAIL, TEXT, IN_PERSON
}

enum class CallType {
    INCOMING, OUTGOING, MISSED
}

enum class TaskStatus {
    TODO, IN_PROGRESS, COMPLETED, CANCELLED
}

enum class Priority {
    LOW, MEDIUM, HIGH, URGENT
}

enum class EstimateStatus {
    DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED
}