import { ScrollView } from 'react-native'
import type { YStackProps } from 'tamagui'
import { YStack } from 'tamagui'

import { Code } from '~/components/Code'
import { Pre } from '~/components/Pre'
import { renderSafeHtml } from '~/features/security/renderSafeHtml'

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
      flexBasis="auto"
      {...props}
    >
      <ScrollView
        contentContainerStyle={{
          minHeight: '100%',
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          contentContainerStyle={{
            minWidth: '100%',
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Pre>
            <Code>{renderSafeHtml(source)}</Code>
          </Pre>
        </ScrollView>
      </ScrollView>
    </YStack>
  )
}
