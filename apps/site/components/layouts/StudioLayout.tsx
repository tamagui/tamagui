import { StudioQueueCard } from '@components/StudioQueueCard'
import { withSupabase } from '@lib/withSupabase'
import { isLocal } from '@protected/studio/constants'
import { Lock } from '@tamagui/lucide-icons'
import { UserGuard, useUser } from 'hooks/useUser'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ButtonLink } from 'studio/Link'
import { ToastProvider as StudioToastProvider } from 'studio/ToastProvider'
import { H2, Paragraph, Spinner, YStack } from 'tamagui'

const StudioLayout = dynamic(() => import('@protected/studio/layout'), { ssr: false })

export const getStudioLayout: GetLayout = (page, pageProps) => {
  return withSupabase(
    <StudioToastProvider>
      <NextSeo title="Studio — Tamagui" />

      <UserGuard>
        <StudioLayout>
          <GithubConnectionGuard>
            <SponsorshipGuard>{page}</SponsorshipGuard>
          </GithubConnectionGuard>
        </StudioLayout>
      </UserGuard>
    </StudioToastProvider>,
    pageProps,
    true
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
  const { teams } = useUser()
  const router = useRouter()

  if (!teams.main) {
    return <Spinner />
  }
  // if (accessStatus.isWhitelisted) {
  //   return (
  //     <>
  //       <WhitelistNotice />
  //       {children}
  //     </>
  //   )
  // }

  if (!isLocal && !router.query?.showStudio) {
    return <StudioQueueCard teamId={teams?.main?.id} />
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
