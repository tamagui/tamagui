import { ThemeTint } from '@tamagui/logo'
import { Check, Copy } from '@tamagui/lucide-icons-2'
import { memo } from 'react'
import { Paragraph, Spacer, TooltipSimple, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'

import { useClipboard } from '~/hooks/useClipboard'

export const InstallInput = memo(() => {
  const installScript = `npm create tamagui`
  const { onCopy, hasCopied } = useClipboard(`${installScript}@latest`)

  return (
    <ThemeTint>
      <XStack
        borderWidth={0.5}
        borderColor="color6"
        overflow="hidden"
        paddingRight="7"
        pl="6"
        height={48}
        items="center"
        self="center"
        rounded="10"
        position="relative"
        elevation="3"
      >
        <YStack
          bg="color9"
          opacity={0.125}
          position="absolute"
          inset={0}
          backdropFilter="blur(50px)"
        />
        <Paragraph
          text="center"
          fontWeight="500"
          fontFamily="mono"
          letterSpacing={1}
          fontSize="sm:3"
          lineHeight="sm:3"
          size="5"
        >
          {installScript}
        </Paragraph>
        <Spacer size="6" />
        <TooltipSimple
          placement="right"
          label={hasCopied ? 'Copied' : 'Copy to clipboard'}
        >
          <Button
            aria-label={installScript}
            size="medium"
            rounded="8"
            mr="-6"
            zIndex={1}
            icon={hasCopied ? Check : Copy}
            onPress={onCopy}
          />
        </TooltipSimple>
      </XStack>
    </ThemeTint>
  )
})
