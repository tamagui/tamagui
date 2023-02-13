import { ReactComponentWithRef, TamaguiElement, isWeb, styled } from '@tamagui/core'
import { SizableText, SizableTextProps } from '@tamagui/text'
import React, { forwardRef } from 'react'
import { Linking } from 'react-native'

export type AnchorProps = SizableTextProps & {
  href?: string
  target?: string
  rel?: string
}

const AnchorFrame = styled(SizableText, {
  name: 'Anchor',
  tag: 'a',
  accessibilityRole: 'link',
})

export const Anchor: ReactComponentWithRef<AnchorProps, TamaguiElement> =
  AnchorFrame.extractable(
    forwardRef(({ href, target, ...props }, ref) => {
      return (
        <AnchorFrame
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
