import { Link, type Href } from 'one'
import * as React from 'react'
import { YStack, XStack, H2, Paragraph } from 'tamagui'

export const TooltipLabelLarge = ({
  title,
  subtitle,
  icon,
  href,
}: { href: string; icon: any; title: string; subtitle: string }) => {
  return (
    <Link asChild href={href as Href}>
      <YStack cur="pointer" f={1} p="$3" br="$4" gap="$1">
        <XStack ai="center" gap="$2">
          <YStack scale={0.7}>{icon}</YStack>
          <H2 ff="$mono" f={1} fow="600" size="$5" ls={1}>
            {title}
          </H2>
        </XStack>

        <Paragraph ff="$mono" px="$2" theme="alt1" f={1} size="$3" ls={-0.5}>
          {subtitle}
        </Paragraph>
      </YStack>
    </Link>
  )
}
