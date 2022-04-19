import { ReactComponentWithRef, isWeb, styled } from '@tamagui/core'
import React, { forwardRef } from 'react'
import { Linking, View } from 'react-native'

import { SizableText, SizableTextProps } from './SizableText'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type AProps = SizableTextProps & {
  href?: string
  target?: string
  rel?: string
}

const AFrame = styled(SizableText, {
  name: 'A',
  tag: 'a',
  accessibilityRole: 'link',
})

export const A: ReactComponentWithRef<AProps, HTMLAnchorElement | View> = AFrame.extractable(
  forwardRef(({ href, target, ...props }: AProps, ref) => {
    return (
      <AFrame
        {...props}
        {...(isWeb
          ? {
              href,
              target,
            }
          : {
              onPress: (event) => {
                props.onPress?.(event)
                if (href !== undefined) {
                  Linking.openURL(href)
                }
              },
            })}
        ref={ref as any}
      />
    )
  })
)
