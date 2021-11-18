import { Text, TextProps, ThemeableProps, themeable } from '@tamagui/core'
import React, { forwardRef } from 'react'

import { InteractiveFrame, InteractiveFrameProps } from './InteractiveFrame'

// bugfix esbuild strips react jsx: 'preserve'
React['keep']

// TODO wrap with paragraph not text
// TODO size="" that affects text as well...

export type ButtonProps = InteractiveFrameProps &
  ThemeableProps & {
    textProps?: Omit<TextProps, 'children'>
    noTextWrap?: boolean
    icon?: JSX.Element | null
    iconAfter?: JSX.Element | null
  }

// NOTE can't use TouchableOpacity, it captures and stops propagation of click events
// which is really important for composability.
// we could maybe add a "touchOpacity" boolean or similar for switching to opacity mode

export const Button = InteractiveFrame.extractable(
  themeable(
    forwardRef(
      (
        {
          children,
          icon,
          iconAfter,
          space = '$1',
          textProps,
          noTextWrap,
          elevation,
          theme: themeName,
          ...props
        }: ButtonProps,
        ref
      ) => {
        return (
          <InteractiveFrame space={space} ref={ref as any} {...props}>
            {icon}
            {noTextWrap ? (
              children
            ) : !children ? null : textProps ? (
              // flex shrink = 1, flex grow = 0 makes buttons shrink properly in native
              <Text
                color="$color2"
                fontSize="$4"
                flexGrow={0}
                flexShrink={1}
                ellipse
                {...textProps}
              >
                {children}
              </Text>
            ) : (
              <Text color="$color2" fontSize="$4" flexGrow={0} flexShrink={1} ellipse>
                {children}
              </Text>
            )}
            {iconAfter}
          </InteractiveFrame>
        )
      }
    )
  )
)
