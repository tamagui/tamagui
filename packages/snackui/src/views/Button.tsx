import React, { forwardRef } from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { spacedChildren } from '../helpers/spacedChildren'
import { ThemeableProps, themeable } from '../helpers/themeable'
import { useTheme } from '../hooks/useTheme'
import { isWeb } from '../platform'
import { StackProps } from '../StackProps'
import { HStack } from './Stacks'
import { Text, TextProps } from './Text'

export type ButtonProps = StackProps &
  ThemeableProps & {
    textProps?: Omit<TextProps, 'children'>
    noTextWrap?: boolean
    icon?: JSX.Element | null
    iconAfter?: JSX.Element | null
    active?: boolean
    chromeless?: boolean
    transparent?: boolean
  }

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing

// NOTE can't use TouchableOpacity, it captures and stops propagation of click events
// which is really important for composability.
// we could maybe add a "touchOpacity" boolean or similar for switching to opacity mode

const defaultStyle: StackProps = {
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
  forwardRef(
    (
      {
        children,
        icon,
        iconAfter,
        spacing = 'sm',
        textProps,
        noTextWrap,
        elevation,
        active,
        disabled,
        chromeless,
        transparent,
        theme: themeName,
        ...props
      }: ButtonProps,
      ref
    ) => {
      const theme = useTheme()
      const childrens = noTextWrap ? (
        children
      ) : !children ? null : textProps ? (
        // flex shrink = 1, flex grow = 0 makes buttons shrink properly in native
        <Text color={theme.color2} fontSize={15} flexGrow={0} flexShrink={1} ellipse {...textProps}>
          {children}
        </Text>
      ) : (
        <Text color={theme.color2} fontSize={15} flexGrow={0} flexShrink={1} ellipse>
          {children}
        </Text>
      )

      const elevationLog = Math.max(1, 1 + Math.log(elevation || 0))

      return (
        <HStack
          ref={ref as any}
          hitSlop={isWeb ? undefined : defaultHitSlop}
          flexShrink={1}
          backgroundColor={theme.bg2}
          {...defaultStyle}
          shadowColor={elevation ? theme.shadowColor : undefined}
          {...(elevation && {
            shadowRadius: 3 * elevationLog,
            shadowOffset: { width: 0, height: 1.5 * elevationLog + 1 },
            shadowOpacity: 0.14 * elevationLog,
          })}
          hoverStyle={
            disabled
              ? null
              : {
                  backgroundColor: theme.bg3,
                }
          }
          pressStyle={
            disabled
              ? null
              : {
                  backgroundColor: theme.bg4,
                }
          }
          {...(active && {
            backgroundColor: theme.bg3,
          })}
          {...(disabled && {
            pointerEvents: 'none',
            opacity: 0.5,
          })}
          {...(chromeless && {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            shadowColor: 'transparent',
          })}
          {...(transparent && {
            backgroundColor: 'transparent',
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
