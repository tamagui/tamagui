import { Check, Copy } from '@tamagui/lucide-icons'
import { memo } from 'react'
import { Button, Paragraph, Spacer, TooltipSimple, XStack } from 'tamagui'

import { useClipboard } from '../lib/useClipboard'

export const InstallInput = memo(() => {
  const installScript = `npm init tamagui-app`
  const { onCopy, hasCopied } = useClipboard(`${installScript}@latest`)

  return (
    <XStack
      borderWidth={1}
      borderColor="$borderColor"
      px="$7"
      pl="$6"
      height={48}
      ai="center"
      als="center"
      elevation="$3"
      bc="$backgroundSoft"
      br="$10"
    >
      <Paragraph
        ta="center"
        size="$4"
        fontWeight="500"
        fontFamily="$mono"
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
          // TODO broken in latest
          icon={
            hasCopied ? (
              <Check size={16} color="var(--colorHover)" />
            ) : (
              <Copy size={16} color="var(--colorHover)" />
            )
          }
          aria-label="Copy the install snippet to Clipboard"
          onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  )
})
