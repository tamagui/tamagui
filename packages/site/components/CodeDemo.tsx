// Inspired by https://github.com/rexxars/react-refractor
import React from 'react'
import { YStack } from 'tamagui'

import { CodeBlock } from './CodeBlock'

type CodeDemoProps = React.ComponentProps<typeof CodeBlock>

export function CodeDemo({ css, line, maxHeight, ...props }: CodeDemoProps) {
  return (
    <YStack
      br="$8"
      className="scroll-vertical"
      maxHeight={maxHeight}
      bc="$backgroundHover"
      boc="$borderColor"
      bw={1}
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
