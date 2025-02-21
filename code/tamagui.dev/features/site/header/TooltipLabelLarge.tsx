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
      <YStack cur="pointer" f={1} p="$3.5" br="$4" gap="$1">
        <XStack jc="center" ai="center" gap="$2">
          <H2 ff="$mono" fow="600" size="$5" ls={1}>
            {title}
          </H2>
          <YStack mr={-7} scale={0.7} y={0.5}>
            {icon}
          </YStack>
        </XStack>

        <Paragraph ff="$mono" px="$2" theme="alt1" f={1} size="$4" ls={-0.5}>
          {subtitle}
        </Paragraph>
      </YStack>
    </Link>
  )
}
