import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { spacedChildren } from '../helpers/spacedChildren'
import { themeable } from '../helpers/themeable'
import { useTheme } from '../hooks/useTheme'
import { HStack, StackProps } from './Stacks'
import { Text, TextProps } from './Text'

export type ButtonProps = StackProps & {
  textProps?: Omit<TextProps, 'children'>
  noTextWrap?: boolean
  theme?: string | null
  icon?: JSX.Element | null
  active?: boolean
}

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing
// TODO auto-chain

// NOTE can't use TouchableOpacity, it captures and stops propagation of click events
// which is really important for composability.
// we could maybe add a "touchOpacity" boolean or similar for switching to opacity mode

export const Button = themeable(
  ({
    children,
    icon,
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
      <Text color={theme.colorSecondary} flexGrow={1} flexShrink={0} ellipse {...textProps}>
        {children}
      </Text>
    ) : (
      <Text color={theme.colorSecondary} flexGrow={1} flexShrink={0} ellipse>
        {children}
      </Text>
    )

    return (
      <HStack
        backgroundColor={theme.backgroundColorSecondary}
        alignSelf="flex-start"
        justifyContent="center"
        alignItems="center"
        cursor="pointer"
        paddingVertical={10}
        flexWrap="nowrap"
        paddingHorizontal={14}
        flexDirection="row"
        borderRadius={8}
        {...(elevation && {
          shadowColor: theme.shadowColor,
          ...getElevation({ elevation }),
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
            icon && childrens
              ? [
                  <React.Fragment key={0}>{icon}</React.Fragment>,
                  <React.Fragment key={1}>{childrens}</React.Fragment>,
                ]
              : icon ?? childrens,
          spacing,
          flexDirection: props.flexDirection,
        })}
      </HStack>
    )
  }
)

const getElevation = ({ elevation }: { elevation: number }) => ({
  shadowRadius: 10 * elevation,
  shadowOffset: { width: 0, height: 2 },
})

if (process.env.IS_STATIC) {
  // @ts-ignore
  Button.staticConfig = extendStaticConfig(HStack, {
    neverFlatten: true,
  })
}
