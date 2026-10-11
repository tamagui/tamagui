import { useState } from 'react'
import { Theme, View } from 'tamagui'
import { Dashboard } from './Dashboard'

/**
 * `Screen.tsx` without the island, for the base qualification. Keep the two
 * identical apart from the island mount.
 */
export function Screen() {
  const [dark, setDark] = useState(false)

  return (
    <Theme name={dark ? 'dark' : 'light'}>
      <View
        data-testid="starter-root"
        backgroundColor="$background"
        padding={24}
        gap={16}
      >
        <Dashboard />
        <button data-testid="starter-theme-toggle" onClick={() => setDark((on) => !on)}>
          toggle theme
        </button>
      </View>
    </Theme>
  )
}
