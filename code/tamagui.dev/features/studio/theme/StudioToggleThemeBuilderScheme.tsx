import { Button, XGroup } from 'tamagui'

import { useRootStore } from '../state/useGlobalState'

export function StudioToggleThemeBuilderScheme() {
  const rootStore = useRootStore()

  return (
    <XGroup bc="transparent" ai="center" jc="center">
      <Button
        theme={rootStore.scheme === 'light' ? 'accent' : null}
        onPress={() => {
          rootStore.theme = 'light'
        }}
        size="$3"
        br="$10"
      >
        Light
      </Button>
      <Button
        theme={rootStore.scheme === 'dark' ? 'accent' : null}
        onPress={() => {
          rootStore.theme = 'dark'
        }}
        size="$3"
        br="$10"
      >
        Dark
      </Button>
    </XGroup>
  )
}
