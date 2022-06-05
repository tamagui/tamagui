import React from 'react'
import { Paragraph, Theme, XStack } from 'tamagui'

import { unwrapText } from './MDXComponents'

export const Notice = ({ children, ...props }) => {
  return (
    <Theme name="yellow">
      <XStack
        borderWidth={1}
        borderColor="$borderColor"
        p="$4"
        py="$3"
        bc="$background"
        br="$2"
        space="$3"
        pos="relative"
        {...props}
      >
        <Paragraph py="$0.5" theme="alt1" mt={-3} mb={-3} className="paragraph-parent" size="$2">
          {unwrapText(children)}
        </Paragraph>
        {/* <Circle
          bw={1}
          pos="absolute"
          t="$-3"
          r="$-3"
          boc="$borderColor"
          size="$7"
        >
          <HelpCircle size={22} color="var(--yellow11)" />
        </Circle> */}
      </XStack>
    </Theme>
  )
}
