// Inspired by https://github.com/rexxars/react-refractor
import React from 'react'
import { YStack } from 'tamagui'

import { CodeBlock } from './CodeBlock'

type CodeDemoProps = React.ComponentProps<typeof CodeBlock>

export function CodeDemo({ css, line, maxHeight, ...props }: CodeDemoProps) {
  return (
    <YStack
      br="$8"
      skewY="30%"
      className="scroll-vertical"
      maxHeight={maxHeight}
      bc="$backgroundHover"
    >
      <CodeBlock
        backgroundColor="transparent"
        borderWidth={0}
        {...props}
        line="0"
        marginBottom={0}
      />
    </YStack>
  )
}
