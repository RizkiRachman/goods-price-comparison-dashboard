import { useRef, useEffect } from 'react'

/**
 * Sync form state when API data loads.
 * Calls `sync` once when `data` transitions from undefined/null to a value.
 * Avoids the react-hooks/set-state-in-effect lint warning by tracking sync state via ref.
 */
export function useSyncFormData<T>(data: T | undefined | null, sync: (data: T) => void) {
  const synced = useRef(false)

  useEffect(() => {
    if (data && !synced.current) {
      synced.current = true
      sync(data)
    }
  }, [data, sync])
}
