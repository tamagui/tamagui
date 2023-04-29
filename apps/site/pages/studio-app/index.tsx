import AnimationsPage from '@protected/studio/(loaded)/(sponsor-protected)/animations/page'
import ColorsPage from '@protected/studio/(loaded)/(sponsor-protected)/colors/page'
import ConfigPage from '@protected/studio/(loaded)/(sponsor-protected)/config/page'
import ThemesPage from '@protected/studio/(loaded)/(sponsor-protected)/themes/page'
import TokensPage from '@protected/studio/(loaded)/(sponsor-protected)/tokens/page'
import { useRequiresLoading } from '@protected/studio/state/useGlobalState'
import { getStudioLayout } from '@tamagui/site/components/layouts/StudioLayout'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Freeze } from 'react-freeze'
import { useDidFinishSSR } from 'tamagui'

export default function Page() {
  useRequiresLoading()
  const hydrated = useDidFinishSSR()
  const [page, setPage] = useState()
  const router = useRouter()

  console.log('router.query', router.query)

  useEffect(() => {}, [])

  if (!hydrated) {
    return null
  }

  return (
    <>
      <StudioPage at="config">
        <ConfigPage />
      </StudioPage>
      <StudioPage at="colors">
        <ColorsPage />
      </StudioPage>
      <StudioPage at="animations">
        <AnimationsPage />
      </StudioPage>
      <ThemesPage />
      <StudioPage at="tokens">
        <TokensPage />
      </StudioPage>
    </>
  )
}

Page.getLayout = getStudioLayout

const StudioPage = (props: { at: string; children: React.ReactNode }) => {
  const router = useRouter()
  const isActive = router.query?.page === props.at
  console.log('isActive', isActive)

  return <Freeze freeze={!isActive}>{props.children}</Freeze>
}
