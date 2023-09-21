import { ThemeName } from "tamagui"
import { Database } from '@my/supabase/types'
import React from "react"

export function useClimbColor(type: Database['public']['Enums']['climb_type']) {
  const color: ThemeName = type === 'lead_rope' ? 'orange' : type === 'top_rope' ? 'blue' : 'purple'
  return React.useMemo(
    () => ({
      color,
    }),
    [color]
  )
}
