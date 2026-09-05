import { Check, Copy } from '@tamagui/lucide-icons-2'
import { memo } from 'react'
import { Paragraph, TooltipSimple, XStack } from 'tamagui'
import { Button } from '~/components/Button'

import { useClipboard } from '~/hooks/useClipboard'

export const InstallInput = memo(() => {
  const installScript = 'npm create tamagui@latest'
  const { onCopy, hasCopied } = useClipboard(installScript)

  return (
    <XStack
      borderWidth={1}
      borderColor="color5"
      bg="color2"
      overflow="hidden"
      paddingRight="2"
      pl="4"
      gap="3"
      height={48}
      items="center"
      self="center"
      rounded={10}
      position="relative"
    >
      <Paragraph
        text="center"
        fontSize={12}
        fontWeight="500"
        fontFamily="mono"
        lineHeight={20}
      >
        {installScript}
      </Paragraph>
      <TooltipSimple placement="right" label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
        <Button
          aria-label={hasCopied ? 'Install command copied' : 'Copy install command'}
          size="sm"
          circular
          variant="quiet"
          zIndex={1}
          icon={hasCopied ? Check : Copy}
          onPress={onCopy}
        />
      </TooltipSimple>
    </XStack>
  )
})
