import { H4, Paragraph, XStack } from '@tamagui/ui'

import { Card } from '~/components/Card'
import { Link } from '~/components/Link'
import { DiscordIcon } from '~/features/icons/DiscordIcon'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { TwitterIcon } from '~/features/icons/TwitterIcon'

export const SocialLinksRow = () => {
  return (
    <XStack gap="$4" $sm={{ flexDirection: 'column' }}>
      <Link
        asChild
        href="https://x.com/tamagui_js"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Card width="33.33%" jc="center" $sm={{ width: 'auto' }} gap="$2" p="$5">
          <TwitterIcon />
          <H4 cursor="pointer" fontFamily="$silkscreen">
            X
          </H4>
          <Paragraph cursor="pointer" theme="alt2">
            Announcements and general updates.
          </Paragraph>
        </Card>
      </Link>
      <Link
        asChild
        href="https://discord.gg/4qh6tdcVDa"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Card width="33.33%" jc="center" gap="$2" $sm={{ width: 'auto' }} p="$5">
          <DiscordIcon />
          {/* TODO this is using $body for other attributes not $silkscreen */}
          <H4 cursor="pointer" fontFamily="$silkscreen">
            Discord
          </H4>
          <Paragraph cursor="pointer" theme="alt2">
            Get involved and get questions answered.
          </Paragraph>
        </Card>
      </Link>
      <Link
        asChild
        href="https://github.com/tamagui/tamagui"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Card width="33.33%" jc="center" $sm={{ width: 'auto' }} gap="$2" p="$5">
          <GithubIcon />
          <H4 cursor="pointer" fontFamily="$silkscreen">
            GitHub
          </H4>
          <Paragraph cursor="pointer" theme="alt2">
            Issues, feature requests, and contributing.
          </Paragraph>
        </Card>
      </Link>
    </XStack>
  )
}
