import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme, View } from 'tamagui'
import SheetIsland from '../.tamagui/zero/SheetIsland.loader'

// An island mounted under a conditional static theme. The compiler cannot pick
// one theme for the bridge, so it emits one descriptor per enumerated branch and
// the mount selects its id with the same condition.
function IslandBranch() {
  const [dark, setDark] = useState(false)
  return (
    <View data-testid="zero-root" padding={24}>
      <button data-testid="theme-toggle" onClick={() => setDark((on) => !on)}>
        toggle
      </button>
      <Theme name={dark ? 'dark' : 'light'}>
        <SheetIsland data-testid="island-mount" />
      </Theme>
    </View>
  )
}

createRoot(document.getElementById('root')!).render(<IslandBranch />)
