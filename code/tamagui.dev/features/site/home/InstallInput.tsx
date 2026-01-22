import { ThemeTint } from '@tamagui/logo'
import { Check, Copy } from '@tamagui/lucide-icons'
import { memo } from 'react'
import { Button, Paragraph, Spacer, TooltipSimple, XStack, YStack } from 'tamagui'

import { useClipboard } from '~/hooks/useClipboard'

export const InstallInput = memo(() => {
  const installScript = `npm create tamagui`
  const { onCopy, hasCopied } = useClipboard(`${installScript}@latest`)

  return (
    <ThemeTint>
      <XStack
        borderWidth={0.5}
        borderColor="$color6"
        overflow="hidden"
        px="$7"
        pl="$6"
        height={48}
        items="center"
        self="center"
        elevation="$3"
        rounded="$10"
        position="relative"
        bg="$color005"
      >
        <YStack z={-1} fullscreen bg="$background02" className="blur-8" />
        <Paragraph
          text="center"
          size="$4"
          fontWeight="500"
          fontFamily="$mono"
          letterSpacing={1}
          $sm={{ size: '$3' }}
        >
          {installScript}
        </Paragraph>
        <Spacer size="$6" />
        <TooltipSimple
          placement="right"
          label={hasCopied ? 'Copied' : 'Copy to clipboard'}
        >
          <Button
            aria-label={installScript}
            size="$3"
            rounded="$8"
            mr="$-6"
            icon={hasCopied ? Check : Copy}
            onPress={onCopy}
          />
        </TooltipSimple>
      </XStack>
    </ThemeTint>
  )
})
