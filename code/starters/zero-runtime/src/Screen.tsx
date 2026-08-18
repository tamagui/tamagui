import { useState } from 'react'
import { Theme, View } from 'tamagui'
import DetailsIsland from '../.tamagui/zero/DetailsIsland.loader'
import { Dashboard } from './Dashboard'

/**
 * The starter's screen, with its one island.
 *
 * `Screen.base.tsx` is this module minus the island, and the two must stay
 * identical apart from that: the base build is what qualifies an integration
 * for zero-runtime at all, and the island build is a separate qualification, so
 * any other difference between them would make the two receipts describe
 * different apps.
 */
export function Screen() {
  // ordinary React state over two literal theme names. The compiler enumerates
  // both branches, so switching themes is a class swap with no theme runtime.
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
        <DetailsIsland data-testid="starter-island-mount" />
      </View>
    </Theme>
  )
}
