import { H4, Paragraph, XStack } from 'tamagui'

import { Card } from '~/components/Card'
import { Link } from '~/components/Link'
import { DiscordIcon } from '~/features/icons/DiscordIcon'
import { GithubIcon } from '~/features/icons/GithubIcon'
import { TwitterIcon } from '~/features/icons/TwitterIcon'

export const SocialLinksRow = () => {
  return (
    <XStack gap="4" flexDirection="max-md:column">
      <Link
        asChild
        href="https://x.com/tamagui_js"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Card width="33.33% max-md:auto" justify="center" gap="1-5" p="6">
          <TwitterIcon />
          <H4 cursor="pointer">X</H4>
          <Paragraph cursor="pointer" color="color-9">
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
        <Card width="33.33% max-md:auto" justify="center" gap="1-5" p="6">
          <DiscordIcon />
          <H4 cursor="pointer">Discord</H4>
          <Paragraph cursor="pointer" color="color-9">
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
        <Card width="33.33% max-md:auto" justify="center" gap="1-5" p="6">
          <GithubIcon />
          <H4 cursor="pointer">GitHub</H4>
          <Paragraph cursor="pointer" color="color-9">
            Issues, feature requests, and contributing.
          </Paragraph>
        </Card>
      </Link>
    </XStack>
  )
}
