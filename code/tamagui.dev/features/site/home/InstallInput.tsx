import { Check, Copy } from '@tamagui/lucide-icons'
import { memo } from 'react'
import { Button, Paragraph, Spacer, TooltipSimple, XStack, YStack } from 'tamagui'

import { useClipboard } from '~/hooks/useClipboard'

export const InstallInput = memo(() => {
  const installScript = `npm create tamagui`
  const { onCopy, hasCopied } = useClipboard(`${installScript}@latest`)

  return (
    <XStack
      borderWidth={0.5}
      borderColor="$color6"
      ov="hidden"
      px="$7"
      pl="$6"
      height={48}
      ai="center"
      als="center"
      elevation="$3"
      br="$10"
    >
      <YStack zi={-1} fullscreen bg="$background02" className="blur-8" />
      <Paragraph
        ta="center"
        size="$5"
        fontWeight="500"
        fontFamily="$mono"
        ls={1}
        $sm={{ size: '$3' }}
      >
        {installScript}
      </Paragraph>
      <Spacer size="$6" />
      <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
        <Button
          accessibilityLabel={installScript}
          size="$3"
          borderRadius="$8"
          mr="$-6"
          x={-1}
          icon={hasCopied ? Check : Copy}
          onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  )
})
