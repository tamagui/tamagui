import { UserGuard } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { ToastProvider as StudioToastProvider } from 'studio/ToastProvider'

import { GithubConnectionGuard, SponsorshipGuard } from './GithubConnectionGuard'

const StudioLayoutImpl = dynamic(() => import('@protected/studio/layout'), { ssr: false })

export const StudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StudioToastProvider>
      <NextSeo title="Studio — Tamagui" />

      <UserGuard>
        <StudioLayoutImpl>
          <GithubConnectionGuard>
            <SponsorshipGuard>{children}</SponsorshipGuard>
          </GithubConnectionGuard>
        </StudioLayoutImpl>
      </UserGuard>
    </StudioToastProvider>
  )
}
