import { StudioQueueCard } from '@components/StudioQueueCard'
import { Lock } from '@tamagui/lucide-icons'
import { ButtonLink } from '~/components/Link'
import { useUser } from 'hooks/useUser'
import { useRouter } from 'next/router'
import { isLocal } from 'protected/constants'
import { H2, Paragraph, Spinner, YStack } from 'tamagui'

export const GithubConnectionGuard = ({ children }: { children: React.ReactNode }) => {
  const { data } = useUser()

  const user = data?.session?.user

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

export const SponsorshipGuard = ({ children }: { children: React.ReactNode }) => {
  const { data } = useUser()
  const router = useRouter()
  const teams = data?.teams
  if (!teams) return null
  const hasAccess = teams?.all?.some(
    (team) => new Date(team.studio_queued_at) < new Date()
  )

  if (!teams.main) {
    return <Spinner />
  }

  if (!hasAccess && !isLocal && !router.query?.showStudio) {
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
