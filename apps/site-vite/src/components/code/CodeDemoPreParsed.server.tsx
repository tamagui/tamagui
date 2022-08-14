import React from 'react'
import { YStack, YStackProps } from 'tamagui'

import { Code } from './Code.client'
import { Pre } from './Pre.client'

export function CodeDemoPreParsed({
  source,
  language,
  ...props
}: Omit<YStackProps, 'children'> & {
  source: string
  language: string
}) {
  return (
    <YStack
      br="$8"
      className={`scroll-horizontal scroll-vertical language-${language}`}
      bc="$backgroundHover"
      boc="$borderColor"
      bw={1}
      f={1}
      {...props}
    >
      <Pre f={1}>
        <Code dangerouslySetInnerHTML={{ __html: source }} />
      </Pre>
    </YStack>
  )
}
