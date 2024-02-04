import React from 'react'
import { ScrollView } from 'react-native'
import type { YStackProps } from 'tamagui'
import { YStack } from 'tamagui'

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
      bg="$backgroundHover"
      bc="$borderColor"
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
        <ScrollView
          horizontal
          contentContainerStyle={{
            flex: 1,
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Pre f={1}>
            {/* @ts-ignore */}
            <Code dangerouslySetInnerHTML={{ __html: source }} />
          </Pre>
        </ScrollView>
      </ScrollView>
    </YStack>
  )
}
