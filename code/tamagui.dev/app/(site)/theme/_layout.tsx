import { Slot } from 'one'
import { useId } from 'react'
import { ThemePage } from '~/features/studio/theme/ThemePage'

export function ThemeLayout() {
  console.warn('hi', useId())
  return (
    <>
      <Slot />

      <ThemePage />
    </>
  )
}
