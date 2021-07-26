import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { spacedChildren } from '../helpers/spacedChildren'
import { themeable } from '../helpers/themeable'
import { useTheme } from '../hooks/useTheme'
import { isWeb } from '../platform'
import { StackProps } from '../StackProps'
import { HStack } from './Stacks'
import { Text, TextProps } from './Text'

export type ButtonProps = StackProps & {
  textProps?: Omit<TextProps, 'children'>
  noTextWrap?: boolean
  theme?: string | null
  icon?: JSX.Element | null
  iconAfter?: JSX.Element | null
  active?: boolean
}

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing

// NOTE can't use TouchableOpacity, it captures and stops propagation of click events
// which is really important for composability.
// we could maybe add a "touchOpacity" boolean or similar for switching to opacity mode

const defaultStyle: StackProps = {
  alignSelf: 'flex-start',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  paddingVertical: 10,
  flexWrap: 'nowrap',
  paddingHorizontal: 14,
  flexDirection: 'row',
  borderRadius: 8,
}

export const Button = themeable(
  ({
    children,
    icon,
    iconAfter,
    spacing = 'sm',
    textProps,
    noTextWrap,
    theme: themeName,
    elevation,
    active,
    ...props
  }: ButtonProps) => {
    const theme = useTheme()
    const childrens = noTextWrap ? (
      children
    ) : !children ? null : textProps ? (
      // flex shrink = 1, flex grow = 0 makes buttons shrink properly in native
      <Text
        color={theme.colorSecondary}
        fontSize={16}
        flexGrow={0}
        flexShrink={1}
        ellipse
        {...textProps}
      >
        {children}
      </Text>
    ) : (
      <Text color={theme.colorSecondary} fontSize={16} flexGrow={0} flexShrink={1} ellipse>
        {children}
      </Text>
    )

    return (
      <HStack
        hitSlop={isWeb ? undefined : defaultHitSlop}
        flexShrink={1}
        backgroundColor={theme.backgroundColorSecondary}
        {...defaultStyle}
        shadowColor={elevation ? theme.shadowColor : undefined}
        {...(elevation && {
          shadowRadius: 3 * elevation,
          shadowOffset: { width: 0, height: 2 * elevation },
          shadowOpacity: 0.18 * elevation,
        })}
        hoverStyle={{
          backgroundColor: theme.backgroundColorTertiary,
        }}
        pressStyle={{
          backgroundColor: theme.backgroundColorQuartenary,
        }}
        {...(active && {
          backgroundColor: theme.backgroundColorTertiary,
        })}
        {...props}
      >
        {spacedChildren({
          children:
            (icon || iconAfter) && childrens
              ? [
                  icon ? <React.Fragment key={0}>{icon}</React.Fragment> : null,
                  <React.Fragment key={1}>{childrens}</React.Fragment>,
                  iconAfter ? <React.Fragment key={2}>{iconAfter}</React.Fragment> : null,
                ]
              : icon ?? childrens,
          spacing,
          flexDirection: props.flexDirection || 'row',
        })}
      </HStack>
    )
  }
)

const defaultHitSlop = {
  top: 5,
  left: 5,
  right: 5,
  bottom: 5,
}

if (process.env.IS_STATIC) {
  // @ts-ignore
  Button.staticConfig = extendStaticConfig(HStack, {
    neverFlatten: true,
    defaultProps: defaultStyle,
  })
}
