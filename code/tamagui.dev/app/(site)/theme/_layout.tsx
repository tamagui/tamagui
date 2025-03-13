import { Slot } from 'one'
import { ThemePage } from '~/features/studio/theme/ThemePage'

export function ThemeLayout() {
  return (
    <>
      <Slot />
      <ThemePage />
    </>
  )
}
