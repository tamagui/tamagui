import React, { memo } from 'react'

import { StackProps, VStack } from './Stacks'
import { Text } from './Text'

export const PageTitle = memo(
  ({ children, subTitle, ...rest }: StackProps & { subTitle?: any }) => {
    return (
      <VStack maxWidth="100%" justifyContent="center" {...rest}>
        <Text
          selectable
          ellipse
          flex={1}
          maxWidth="80%"
          opacity={1}
          fontSize={20}
          lineHeight={22}
          fontWeight="600"
        >
          {children}
          {!!subTitle && (
            <>
              <br />
              <Text
                selectable
                ellipse
                width="100%"
                color="#666"
                fontSize={14}
                fontWeight="200"
              >
                {subTitle}
              </Text>
            </>
          )}
        </Text>
        {/* <Divider alignSelf="flex-end" /> */}
      </VStack>
    )
  }
)
