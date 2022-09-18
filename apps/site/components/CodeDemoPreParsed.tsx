import React from 'react'
import { ScrollView } from 'react-native'
import { YStack, YStackProps } from 'tamagui'

import { Code } from './Code'
import { Pre } from './Pre'

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
      br="$4"
      className={`language-${language}`}
      bc="$backgroundHover"
      boc="$borderColor"
      ov="hidden"
      bw={1}
      f={1}
      {...props}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Pre f={1}>
          <Code dangerouslySetInnerHTML={{ __html: source }} />
        </Pre>
      </ScrollView>
    </YStack>
  )
}
