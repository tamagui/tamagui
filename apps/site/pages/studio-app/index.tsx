import AnimationsPage from '@protected/studio/(loaded)/(sponsor-protected)/animations/page'
import ColorsPage from '@protected/studio/(loaded)/(sponsor-protected)/colors/page'
import ConfigPage from '@protected/studio/(loaded)/(sponsor-protected)/config/page'
import { PreviewPage } from '@protected/studio/(loaded)/(sponsor-protected)/preview/page'
import ThemesPage from '@protected/studio/(loaded)/(sponsor-protected)/themes/page'
import TokensPage from '@protected/studio/(loaded)/(sponsor-protected)/tokens/page'
import { isLocal } from '@protected/studio/constants'
import LoadPage from '@protected/studio/load/page'
import { Tab } from '@protected/studio/state/types'
import { getStudioLayout } from '@tamagui/site/components/layouts/StudioLayout'
import { useSelector } from '@tamagui/use-store'
import { useRouter } from 'next/router'
import React, {
  Suspense,
  memo,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { YStack, useDidFinishSSR, useThemeName } from 'tamagui'

import { rootStore } from '../../app/(protected)/studio/state/RootStore'
import { themesStore } from '../../app/(protected)/studio/state/ThemesStore'

export default function Page() {
  const hydrated = useDidFinishSSR()

  const fsReadSucceeded = useSelector(() => rootStore.fsReadSucceeded)

  if (!hydrated) {
    return null
  }

  return (
    <React.StrictMode>
      {!fsReadSucceeded && !isLocal ? <LoadPage /> : <StudioContents />}
    </React.StrictMode>
  )
}

function StudioContents() {
  // init state
  useStudioInitialize()

  return useMemo(() => {
    return (
      <>
        <StudioTab isHome at="view" Page={PreviewPage} />
        <StudioTab at="config" Page={ConfigPage} />
        <StudioTab at="colors" Page={ColorsPage} />
        <StudioTab at="animations" Page={AnimationsPage} />
        <StudioTab at="themes" Page={ThemesPage} />
        <StudioTab at="tokens" Page={TokensPage} />
      </>
    )
  }, [])
}

function useStudioInitialize() {
  useSyncTabToCurrentPaneState()
  useSyncThemeToThemeState()
}

function useSyncThemeToThemeState() {
  const themeName = useThemeName()

  useLayoutEffect(() => {
    themesStore.toggleFocusedThemeItem({
      id: themeName,
    })
  }, [themeName])
}

function useSyncTabToCurrentPaneState() {
  const router = useRouter()
  const tab = router.query.tab

  useEffect(() => {
    rootStore.currentPane = (`${tab || ''}` || 'view') as Tab
  }, [tab])
}

Page.getLayout = getStudioLayout

const StudioTab = memo(
  ({
    at,
    Page,
    isHome,
  }: {
    at: string
    Page: React.FunctionComponent
    isHome?: boolean
  }) => {
    const router = useRouter()
    const tab = router.query.tab
    const isActive = tab === at || (!tab && isHome)
    const [isPending, startTransition] = useTransition()
    console.log('tab', tab, isPending)
    const [isMounted, setIsMounted] = useState(isActive)

    useEffect(() => {
      startTransition(() => {
        console.warn('start transition')
        setIsMounted(isActive)
      })
    }, [isActive])

    const childrenMemo = useMemo(() => <Page />, [Page])

    if (!isMounted) {
      return null
    }

    return (
      <Suspense fallback={null}>
        <YStack
          style={{
            position: 'absolute',
            // @ts-ignore
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            ...(isActive && {
              opacity: 1,
              pointerEvents: 'auto',
            }),
          }}
        >
          {childrenMemo}
        </YStack>
      </Suspense>
    )
  }
)
