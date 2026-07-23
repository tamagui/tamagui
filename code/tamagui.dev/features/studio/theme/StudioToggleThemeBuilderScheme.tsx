import { XGroup } from 'tamagui'
import { Button } from '~/components/Button'

import { useRootStore } from '../state/useGlobalState'

export function StudioToggleThemeBuilderScheme() {
  const rootStore = useRootStore()

  return (
    <XGroup bg="transparent" items="center" justify="center">
      <Button
        theme={rootStore.scheme === 'light' ? 'accent' : null}
        onPress={() => {
          rootStore.theme = 'light'
        }}
        size="medium"
        rounded="$10"
      >
        Light
      </Button>
      <Button
        theme={rootStore.scheme === 'dark' ? 'accent' : null}
        onPress={() => {
          rootStore.theme = 'dark'
        }}
        size="medium"
        rounded="$10"
      >
        Dark
      </Button>
    </XGroup>
  )
}
