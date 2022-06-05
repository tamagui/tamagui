// Inspired by https://github.com/rexxars/react-refractor
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { YStack } from 'tamagui'

import type { CodeBlockProps } from './CodeBlock'

type CodeDemoProps = CodeBlockProps

export function CodeDemo({ css, line, maxHeight, height, ...props }: CodeDemoProps) {
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
      bc="$backgroundHover"
      boc="$borderColor"
      bw={1}
      // for hero code
      f={1}
    >
      {!!Comp && (
        <Comp backgroundColor="transparent" borderWidth={0} {...props} line="0" marginBottom={0} />
      )}
    </YStack>
  )
}
