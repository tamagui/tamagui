import AnimationsPage from '@protected/studio/(loaded)/(sponsor-protected)/animations/page'
import ColorsPage from '@protected/studio/(loaded)/(sponsor-protected)/colors/page'
import ConfigPage from '@protected/studio/(loaded)/(sponsor-protected)/config/page'
import { PreviewPage } from '@protected/studio/(loaded)/(sponsor-protected)/preview/page'
import ThemesPage from '@protected/studio/(loaded)/(sponsor-protected)/themes/page'
import TokensPage from '@protected/studio/(loaded)/(sponsor-protected)/tokens/page'
import { Tab } from '@protected/studio/state/types'
import { useRequiresLoading } from '@protected/studio/state/useGlobalState'
import { getStudioLayout } from '@tamagui/site/components/layouts/StudioLayout'
import { useRouter } from 'next/router'
import React, {
  startTransition,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { YStack, useDidFinishSSR, useThemeName } from 'tamagui'

import { rootStore } from '../../app/(protected)/studio/state/RootStore'
import { themesStore } from '../../app/(protected)/studio/state/ThemesStore'

export default function Page() {
  useRequiresLoading()

  const hydrated = useDidFinishSSR()

  if (!hydrated) {
    return null
  }

  return <StudioContents />
}

function StudioContents() {
  // init state
  useStudioInitialize()

  return useMemo(() => {
    return (
      <>
        <StudioTab isHome at="view">
          <PreviewPage />
        </StudioTab>
        <StudioTab at="config">
          <ConfigPage />
        </StudioTab>
        <StudioTab at="colors">
          <ColorsPage />
        </StudioTab>
        <StudioTab at="animations">
          <AnimationsPage />
        </StudioTab>
        <StudioTab at="themes">
          <ThemesPage />
        </StudioTab>
        <StudioTab at="tokens">
          <TokensPage />
        </StudioTab>
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

const StudioTab = (props: {
  at: string
  children: React.ReactNode
  isHome?: boolean
}) => {
  const router = useRouter()
  const tab = router.query.tab
  const isActive = tab === props.at || (!tab && props.isHome)
  const [isMounted, setIsMounted] = useState(isActive)

  useEffect(() => {
    startTransition(() => {
      setIsMounted(isActive)
    })
  }, [isActive])

  if (!isMounted) {
    return null
  }

  return (
    <YStack
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
        pointerEvents: 'none',
        ...(isActive && {
          opacity: 1,
          pointerEvents: 'auto',
        }),
      }}
    >
      {props.children}
    </YStack>
  )
}
