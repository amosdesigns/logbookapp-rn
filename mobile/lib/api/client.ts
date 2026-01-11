import axios, { type AxiosInstance } from 'axios'
import Constants from 'expo-constants'
import type { Result } from '../types'
import type {
  User,
  DutySession,
  Location,
  Log,
  Shift,
  SafetyChecklistItem,
  Message,
  Notification,
  GetLogsParams,
  GetShiftsParams,
  CreateLogInput,
  UpdateLogInput,
  ClockInInput,
  ChecklistSubmission,
} from '../types'

const API_URL = Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  'http://localhost:3000/api/mobile'

export class ApiClient {
  private client: AxiosInstance
  private getToken: () => Promise<string | null>

  constructor(getToken: () => Promise<string | null>) {
    this.getToken = getToken
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 second timeout
    })

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - maybe trigger sign out
          console.error('Unauthorized - session expired')
        }
        return Promise.reject(error)
      }
    )
  }

  // ============================================
  // DUTY MANAGEMENT
  // ============================================

  async getActiveDutySession(): Promise<Result<DutySession | null>> {
    const { data } = await this.client.get<Result<DutySession | null>>('/duty/active')
    return data
  }

  async clockIn(input: ClockInInput): Promise<Result<DutySession>> {
    const { data } = await this.client.post<Result<DutySession>>('/duty/clock-in', input)
    return data
  }

  async clockOut(dutySessionId: string, notes?: string): Promise<Result<DutySession>> {
    const { data } = await this.client.post<Result<DutySession>>('/duty/clock-out', {
      dutySessionId,
      notes,
    })
    return data
  }

  // ============================================
  // SAFETY CHECKLIST
  // ============================================

  async getSafetyChecklistItems(): Promise<Result<SafetyChecklistItem[]>> {
    const { data } = await this.client.get<Result<SafetyChecklistItem[]>>('/safety/items')
    return data
  }

  async submitSafetyChecklist(
    dutySessionId: string,
    locationId: string,
    items: ChecklistSubmission[]
  ): Promise<Result<{ responseId: string; logId: string }>> {
    const { data } = await this.client.post<Result<{ responseId: string; logId: string }>>(
      '/safety/submit',
      { dutySessionId, locationId, items }
    )
    return data
  }

  // ============================================
  // LOCATIONS
  // ============================================

  async getActiveLocations(): Promise<Result<Location[]>> {
    const { data } = await this.client.get<Result<Location[]>>('/locations/active')
    return data
  }

  // ============================================
  // LOGS
  // ============================================

  async getLogs(params?: GetLogsParams): Promise<Result<Log[]>> {
    const { data } = await this.client.get<Result<Log[]>>('/logs', {
      params,
    })
    return data
  }

  async getLogById(id: string): Promise<Result<Log>> {
    const { data } = await this.client.get<Result<Log>>(`/logs/${id}`)
    return data
  }

  async createLog(logData: CreateLogInput): Promise<Result<Log>> {
    const { data } = await this.client.post<Result<Log>>('/logs', logData)
    return data
  }

  async updateLog(id: string, logData: UpdateLogInput): Promise<Result<Log>> {
    const { data } = await this.client.patch<Result<Log>>(`/logs/${id}`, logData)
    return data
  }

  async deleteLog(id: string): Promise<Result<{ id: string }>> {
    const { data } = await this.client.delete<Result<{ id: string }>>(`/logs/${id}`)
    return data
  }

  // ============================================
  // SHIFTS
  // ============================================

  async getShifts(params: GetShiftsParams): Promise<Result<Shift[]>> {
    const { data} = await this.client.get<Result<Shift[]>>('/shifts', { params })
    return data
  }

  // ============================================
  // MESSAGES
  // ============================================

  async getMyMessages(): Promise<Result<Message[]>> {
    const { data } = await this.client.get<Result<Message[]>>('/messages')
    return data
  }

  async sendMessage(content: string): Promise<Result<Message>> {
    const { data } = await this.client.post<Result<Message>>('/messages', {
      content,
    })
    return data
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  async getNotifications(): Promise<Result<Notification[]>> {
    const { data } = await this.client.get<Result<Notification[]>>('/notifications')
    return data
  }

  async dismissNotification(id: string): Promise<Result<void>> {
    const { data } = await this.client.patch<Result<void>>(`/notifications/${id}/dismiss`)
    return data
  }
}

// Factory function to create API client with Clerk auth
export function createApiClient(getToken: () => Promise<string | null>): ApiClient {
  return new ApiClient(getToken)
}
