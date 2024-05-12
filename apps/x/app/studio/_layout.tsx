import { Slot, usePathname } from 'vxs'
import { memo } from 'react'
import {
  Dialog,
  YStack,
  useIsomorphicLayoutEffect,
  useThemeName,
  PortalHost,
} from 'tamagui'

// TODO
import { Dialogs } from '~/studio/providers/Dialogs'
import { SidePaneHost } from '~/studio/SidePane'
import { useConfigReady } from '~/studio/hooks/useConfigReady'
// import { colorsStore } from './state/ColorsStore'
// import { rootStore } from './state/RootStore'
// import { themesStore } from './state/ThemesStore'
import { StudioBar } from '~/studio/bar/StudioBar'
// import { RequireAuth } from './SupabaseProvider'

function useStudioInitialize() {
  useSyncThemeToThemeState()
}

function useSyncThemeToThemeState() {
  const themeName = useThemeName()

  useIsomorphicLayoutEffect(() => {
    // TODO
    // themesStore.toggleFocusedThemeItem({
    //   id: themeName,
    // })
  }, [themeName])
}

export default memo((props: { children?: any }) => {
  const pathname = usePathname()

  // TODO
  // useConfigReady(() => {
  //   rootStore.init().then(() => {
  //     colorsStore.init()
  //     themesStore.init()
  //   })
  // })

  useStudioInitialize()

  return (
    <Dialog modal>
      <YStack fullscreen ov="hidden">
        <Dialogs />
        {pathname !== '/builder' && <StudioBar />}
        <SidePaneHost />
        <YStack zi={0} ai="center" jc="center" bg="$background" f={1} w="100%" h="100%">
          {/* <RequireAuth> */}
          <Slot />
          {/* </RequireAuth> */}
          <PortalHost name="studio" />
        </YStack>
      </YStack>
    </Dialog>
  )
})
