// User & Auth
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'SUPERVISOR' | 'GUARD'

export interface User {
  id: string
  clerkId: string
  email: string
  firstName: string | null
  lastName: string | null
  username: string | null
  phoneNumber: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

// Duty Management
export interface DutySession {
  id: string
  userId: string
  locationId: string | null
  clockInTime: Date
  clockOutTime: Date | null
  shiftId: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  // Relations
  location?: Location | null
  shift?: Shift | null
  user?: User
}

// Locations
export interface Location {
  id: string
  name: string
  address: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Logs
export type LogType =
  | 'INCIDENT'
  | 'PATROL'
  | 'VISITOR_CHECKIN'
  | 'MAINTENANCE'
  | 'WEATHER'
  | 'OTHER'
  | 'ON_DUTY_CHECKLIST'

export type RecordStatus = 'LIVE' | 'UPDATED' | 'ARCHIVED' | 'DRAFT'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Log {
  id: string
  type: LogType
  title: string
  description: string
  status: RecordStatus
  severity: Severity | null
  locationId: string
  userId: string
  shiftId: string | null
  incidentTime: Date | null
  peopleInvolved: string | null
  witnesses: string | null
  actionsTaken: string | null
  followUpRequired: boolean
  reviewedBy: string | null
  reviewedAt: Date | null
  reviewNotes: string | null
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
  // Relations
  location?: Location
  user?: User
  shift?: Shift | null
  reviewer?: User | null
}

// Shifts
export interface Shift {
  id: string
  name: string
  startTime: Date
  endTime: Date
  locationId: string
  supervisorId: string | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
  // Relations
  location?: Location
  supervisor?: User | null
  guards?: User[]
}

// Safety Checklist
export interface SafetyChecklistItem {
  id: string
  name: string
  description: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Messages
export interface Message {
  id: string
  senderId: string
  recipientId: string | null
  dutySessionId: string | null
  message: string
  isRead: boolean
  createdAt: Date
  // Relations
  sender?: User
  recipient?: User | null
  dutySession?: DutySession | null
}

// Notifications
export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'ALERT'
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Notification {
  id: string
  userId: string | null
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  dismissible: boolean
  dismissedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export type Result<T> =
  | { ok: true; data: T; message?: string; meta?: Record<string, unknown> }
  | { ok: false; message: string; code?: string; meta?: Record<string, unknown> }

// Query Params
export interface GetLogsParams {
  locationId?: string
  type?: LogType
  status?: RecordStatus
  search?: string
  year?: string
  month?: string
  dayOfWeek?: string
}

export interface GetShiftsParams {
  startDate: string
  endDate: string
  locationId?: string
}

// Form Inputs (from Zod schemas)
export interface CreateLogInput {
  type: LogType
  title: string
  description: string
  locationId: string
  shiftId?: string
  status: RecordStatus
}

export interface UpdateLogInput extends Partial<CreateLogInput> {}

export interface ClockInInput {
  locationId?: string
  shiftId?: string
}

export interface ChecklistSubmission {
  itemId: string
  checked: boolean
  notes?: string
}
