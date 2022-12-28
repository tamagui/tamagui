import { Mail } from '@tamagui/lucide-icons'
import { Heart } from '@tamagui/lucide-icons'
import { memo } from 'react'
import { Button, Input, Spacer, TooltipSimple, XStack } from 'tamagui'

import { NextLink } from './NextLink'

export const MailingListSignup = memo(() => {
  return (
    <NextLink target="_blank" href="https://github.com/sponsors/natew">
      <Button
        theme="red"
        icon={<Heart style={{ marginBottom: -0.5 }} size={18} color="var(--red10)" />}
        als="center"
        elevation="$4"
        borderWidth={1}
        borderColor="$color5"
        size="$5"
        fontFamily="$silkscreen"
        bc="$color1"
        br="$10"
      >
        Sponsor
      </Button>
    </NextLink>
  )

  return (
    <XStack
      borderWidth={1}
      borderColor="$borderColor"
      px="$7"
      pl="$6"
      height={48}
      ai="center"
      als="center"
      elevation="$2"
      bc="$background"
      br="$10"
    >
      <Input
        bc="transparent"
        borderWidth={0}
        w={200}
        placeholder="Signup for the newsletter"
        p={0}
        focusStyle={{
          borderWidth: 0,
        }}
      />
      <Spacer size="$6" />
      <TooltipSimple label="Signup for occasional updates">
        <Button
          accessibilityLabel="Signup to the mailing list"
          size="$3"
          borderRadius="$8"
          mr="$-6"
          x={-1}
          icon={Mail}
          // onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  )
})
