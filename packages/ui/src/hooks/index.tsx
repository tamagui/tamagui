import { ThemeName } from 'tamagui'
import { Tables } from '@my/supabase/helpers'
import React from 'react'

export function useClimbColor(type: Tables<'climbs'>['type'] | undefined) {
  const color: ThemeName =
    type === 'lead_rope' ? 'orange' : type === 'top_rope' ? 'blue' : 'purple'

  return React.useMemo(
    () => ({
      color,
    }),
    [color]
  )
}
