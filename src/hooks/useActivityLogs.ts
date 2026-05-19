import {
  createListQueryHook,
  createDetailQueryHook,
} from '@/lib/query-factory'
import { activityLogsApi, type ActivityLogListParams } from '@/api/activity-logs'
import type { ActivityLog, ActivityLogListResponse } from '@/types/api'

export const useActivityLogsList = createListQueryHook<
  ActivityLogListParams,
  ActivityLogListResponse
>('activity-logs', activityLogsApi.list, { refetchOnMount: 'always' })

export const useActivityLog = createDetailQueryHook<ActivityLog>(
  'activity-logs',
  activityLogsApi.get,
  { refetchOnMount: 'always' },
)
