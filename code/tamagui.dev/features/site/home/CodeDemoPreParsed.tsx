import { ScrollView } from 'react-native'
import type { YStackProps } from 'tamagui'
import { YStack } from 'tamagui'

import { Code } from '~/components/Code'
import { Pre } from '~/components/Pre'

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
      rounded="$4"
      className={`language-${language}`}
      bg="$backgroundHover"
      borderColor="$borderColor"
      overflow="hidden"
      borderWidth={1}
      flex={1}
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
          <Pre flex={1}>
            <Code dangerouslySetInnerHTML={{ __html: source }} />
          </Pre>
        </ScrollView>
      </ScrollView>
    </YStack>
  )
}
