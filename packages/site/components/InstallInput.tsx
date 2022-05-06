import { Check, Copy } from '@tamagui/feather-icons'
import copy from 'copy-to-clipboard'
import React, { memo, useEffect } from 'react'
import { Button, Paragraph, Spacer, Tooltip, XStack } from 'tamagui'

export const InstallInput = memo(() => {
  const [hasCopied, setHasCopied] = React.useState(false)

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
      elevation="$4"
      br="$10"
      bc="$backgroundHover"
      // elevation="$1"
      hoverStyle={{
        bc: '$background',
      }}
    >
      <Paragraph ta="center" size="$5" letterSpacing={0.5} fontWeight="500" fontFamily="$mono">
        npm install tamagui
      </Paragraph>
      <Spacer size="$6" />
      <Tooltip>
        <Tooltip.Trigger>
          <Button
            borderRadius="$8"
            mr="$-7"
            x={-3}
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
              copy('npm install tamagui')
              setHasCopied(true)
            }}
          />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Paragraph>Copy to clipboard</Paragraph>
        </Tooltip.Content>
      </Tooltip>
    </XStack>
  )
})
