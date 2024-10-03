import { Paragraph, Spacer, XStack, YStack } from 'tamagui'
import { SocialLinksRow } from '~/features/site/SocialLinksRow'
import { OneBall } from '../brand/Logo'

export const Footer = () => {
  return (
    <XStack
      group="card"
      py="$10"
      ai="center"
      jc="space-between"
      $sm={{
        fd: 'column',
        jc: 'center',
      }}
    >
      <XStack
        ai="center"
        gap="$5"
        $sm={{
          fd: 'column',
          jc: 'center',
        }}
      >
        <YStack $sm={{ x: 3 }}>
          <OneBall />
        </YStack>

        <XStack>
          <SocialLinksRow />
        </XStack>
      </XStack>

      <Paragraph $sm={{ mt: '$8' }} o={0.5}>
        Copyright 2024 Tamagui, LLC
      </Paragraph>
    </XStack>
  )
}
