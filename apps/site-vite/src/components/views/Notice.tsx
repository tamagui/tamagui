import React from 'react'
import { Paragraph, Theme, XStack } from 'tamagui'

import { unwrapText } from '../lib/unwrapText'

export const Notice = ({ children, theme = 'yellow', ...props }: any) => {
  return (
    <Theme name={theme}>
      <XStack
        borderWidth={1}
        borderColor="$borderColor"
        p="$4"
        py="$3"
        bc="$background"
        br="$4"
        space="$3"
        my="$4"
        pos="relative"
        {...props}
      >
        <Paragraph py="$2" theme="alt1" mt={-3} mb={-3} className="paragraph-parent">
          {unwrapText(children)}
        </Paragraph>
      </XStack>
    </Theme>
  )
}
