import { Check, Copy } from '@tamagui/feather-icons'
import copy from 'copy-to-clipboard'
import React, { memo, useEffect } from 'react'
import { Button, Paragraph, Spacer, Tooltip, TooltipSimple, XStack } from 'tamagui'

export const InstallInput = memo(() => {
  const [hasCopied, setHasCopied] = React.useState(false)
  const installScript = `npm create tamagui-app@latest`

  useEffect(() => {
    if (hasCopied) {
      const tm = setTimeout(() => {
        setHasCopied(false)
      }, 2000)
      return () => clearTimeout(tm)
    }
  }, [hasCopied])

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
      br="$10"
      bc="$background"
      hoverStyle={{
        bc: '$background',
      }}
    >
      <Paragraph ta="center" size="$4" fontWeight="500" fontFamily="$mono" $sm={{ size: '$3' }}>
        {installScript}
      </Paragraph>
      <Spacer size="$6" />
      <TooltipSimple label={hasCopied ? 'Copied' : 'Copy to clipboard'}>
        <Button
          accessibilityLabel={installScript}
          borderRadius="$8"
          mr="$-7"
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
          onPress={() => {
            copy(installScript)
            setHasCopied(true)
          }}
        />
      </TooltipSimple>
    </XStack>
  )
})
