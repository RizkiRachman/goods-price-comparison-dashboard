import { apiClient } from './client'
import { cleanParams } from '@/lib/utils'
import type {
  ActivityLog,
  ActivityLogListResponse,
  ActivityLogType,
  ActivityLogAction,
} from '@/types/api'

export interface ActivityLogListParams {
  page?: number
  pageSize?: number
  type?: ActivityLogType
  action?: ActivityLogAction
  from?: string
  to?: string
  sortBy?: 'createdAt' | 'type' | 'action'
  sortOrder?: 'asc' | 'desc'
  [key: string]: unknown
}

export const activityLogsApi = {
  list: (params?: ActivityLogListParams) => {
    const cleaned = cleanParams(params)
    const config = cleaned && Object.keys(cleaned).length > 0 ? { params: cleaned } : {}
    return apiClient
      .get<ActivityLogListResponse>('/v1/activity-logs', config)
      .then((r) => r.data)
  },

  get: (id: number | string) =>
    apiClient.get<ActivityLog>(`/v1/activity-logs/${id}`).then((r) => r.data),
}
