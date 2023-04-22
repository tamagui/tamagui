import { access } from 'fs'

import { withSupabase } from '@lib/withSupabase'
import { WhitelistNotice } from '@protected/studio/(loaded)/(sponsor-protected)/SponsorshipRequired'
import { Lock } from '@tamagui/lucide-icons'
import { ButtonLink } from 'app/Link'
import { MyUserContextProvider, UserGuard, useUser } from 'hooks/useUser'
import dynamic from 'next/dynamic'
import { H2, Paragraph, Spinner, YStack } from 'tamagui'

import { ToastProvider as StudioToastProvider } from '../../app/ToastProvider'
import StudioSplashPage from '../../pages/studio/splash'
import { getDefaultLayout } from './DefaultLayout'

const StudioLayout = dynamic(() => import('@protected/studio/layout'), { ssr: false })

export const getStudioLayout: GetLayout = (page, pageProps) => {
  if (pageProps.unauthenticated) {
    return getDefaultLayout(<StudioSplashPage />, pageProps)
  }

  return withSupabase(
    <MyUserContextProvider>
      <StudioToastProvider>
        <StudioLayout>
          <UserGuard>
            <GithubConnectionGuard>
              <SponsorshipGuard>{page}</SponsorshipGuard>
            </GithubConnectionGuard>
          </UserGuard>
        </StudioLayout>
      </StudioToastProvider>
    </MyUserContextProvider>,
    pageProps
  )
}

const GithubConnectionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()

  if (!user?.app_metadata.providers.includes('github')) {
    return (
      <ErrorScreen
        title="GitHub account not connected."
        message="This page is only accessible for sponsors. We need your GitHub account connected to check your status."
        action={{ url: '/account', text: 'Connect GitHub' }}
      />
    )
  }
  return <>{children}</>
}

const SponsorshipGuard = ({ children }: { children: React.ReactNode }) => {
  const { accessStatus } = useUser()

  if (!accessStatus) {
    return <Spinner />
  }

  if (accessStatus.isWhitelisted) {
    return (
      <>
        <WhitelistNotice />
        {children}
      </>
    )
  }

  if (!accessStatus.isSponsor) {
    return (
      <ErrorScreen
        title="Studio is only accessible for sponsors."
        message="You are not a tamagui sponsor. Sponsor the project to access Studio."
        action={{ url: 'https://github.com/sponsors/natew', text: 'Sponsor Tamagui' }}
      />
    )
  }

  if (!accessStatus.access.studio) {
    return (
      <ErrorScreen
        title="Studio is only accessible for sponsors."
        message=" You are a sponsor, but your tier doesn't include Studio access. Please get a tier that includes Studio."
        action={{ url: 'https://github.com/sponsors/natew', text: 'Sponsor Tamagui' }}
      />
    )
  }

  return <>{children}</>
}

const ErrorScreen = ({
  title = 'Error',
  message,
  action,
}: {
  title?: string
  message?: string
  action?: {
    text: string
    url: string
  }
}) => {
  return (
    <YStack padding="$2" alignItems="center" space>
      <Lock size="$10" />
      <H2 textAlign="center">{title}</H2>
      {!!message && <Paragraph textAlign="center">{message}</Paragraph>}{' '}
      {action && <ButtonLink href={action.url}>{action.text}</ButtonLink>}
    </YStack>
  )
}
