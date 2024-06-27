// Inspired by https://github.com/rexxars/react-refractor
import dynamic from 'next/dynamic'
import React, { Suspense, useEffect, useState } from 'react'
import { YStack } from 'tamagui'

import type { CodeBlockProps } from './CodeBlock'

export function CodeDemo({
  css,
  line,
  maxHeight,
  height,
  minWidth,
  ...props
}: CodeBlockProps) {
  const [Comp, setComp] = useState<any>(null)

  useEffect(() => {
    const CodeBlock = dynamic(() => import('./CodeBlock'))
    setComp(CodeBlock)
  }, [])

  return (
    <YStack
      br="$8"
      className="scroll-vertical"
      maxHeight={maxHeight}
      height={height}
      minWidth={minWidth}
      bg="$backgroundHover"
      bc="$borderColor"
      bw={1}
      // for hero code
      f={1}
    >
      {!!Comp && (
        <Comp
          backgroundColor="transparent"
          borderWidth={0}
          {...props}
          line="0"
          marginBottom={0}
        />
      )}
    </YStack>
  )
}
