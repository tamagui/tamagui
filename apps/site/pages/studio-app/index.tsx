import AnimationsPage from '@protected/studio/(loaded)/(sponsor-protected)/animations/page'
import ColorsPage from '@protected/studio/(loaded)/(sponsor-protected)/colors/page'
import ConfigPage from '@protected/studio/(loaded)/(sponsor-protected)/config/page'
import ThemesPage from '@protected/studio/(loaded)/(sponsor-protected)/themes/page'
import TokensPage from '@protected/studio/(loaded)/(sponsor-protected)/tokens/page'
import { useRequiresLoading } from '@protected/studio/state/useGlobalState'
import { getStudioLayout } from '@tamagui/site/components/layouts/StudioLayout'
import { useRouter } from 'next/router'
import React, { startTransition, useEffect, useState } from 'react'
import { Freeze } from 'react-freeze'
import { useDidFinishSSR } from 'tamagui'

export default function Page() {
  useRequiresLoading()
  const hydrated = useDidFinishSSR()

  if (!hydrated) {
    return null
  }

  return (
    <>
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
}

Page.getLayout = getStudioLayout

const StudioTab = (props: { at: string; children: React.ReactNode }) => {
  const router = useRouter()
  const isActive = router.query.tab === props.at
  const [idle, setIdle] = useState(false)

  return (
    <div
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
    </div>
  )
}
