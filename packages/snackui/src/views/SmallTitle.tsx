import React, { memo } from 'react'

import { Divider } from './Divider'
import { Spacer } from './Spacer'
import { HStack, StackProps, VStack } from './Stacks'
import { Text, TextProps } from './Text'

export const SmallTitle = memo(
  ({
    children,
    isActive,
    divider = 'bottom',
    after,
    color,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textAlign,
    ...rest
  }: StackProps &
    TextProps & {
      after?: any
      isActive?: boolean
      divider?: 'center' | 'bottom' | 'off'
    }) => {
    const dividerElement = color ? (
      <Divider backgroundColor={color} opacity={0.1} />
    ) : (
      <Divider />
    )
    return (
      <VStack alignItems="center" {...rest}>
        <HStack width="100%" alignItems="center" justifyContent="center">
          {divider === 'center' && dividerElement}
          <Text
            paddingHorizontal={30}
            {...{
              letterSpacing: letterSpacing ?? -0.25,
              color: color ?? (isActive ? '#000' : '#888'),
              fontSize: fontSize ?? 16,
              fontWeight: fontWeight ?? '500',
              lineHeight,
              textAlign,
            }}
          >
            {children}
          </Text>
          {divider === 'center' && dividerElement}
          {after && (
            <>
              <Spacer size="xs" />
              {after}
            </>
          )}
        </HStack>
        {divider === 'bottom' && (
          <>
            <Spacer size="sm" />
            {dividerElement}
          </>
        )}
      </VStack>
    )
  }
)

export const SmallerTitle = memo(
  ({
    children,
    hideDivider,
    ...rest
  }: StackProps & { hideDivider?: boolean }) => {
    return (
      <HStack alignItems="center" justifyContent="center" spacing {...rest}>
        {!hideDivider && <Divider flex />}
        <Text opacity={0.5} fontSize={14} fontWeight="500">
          {children}
        </Text>
        {!hideDivider && <Divider flex />}
      </HStack>
    )
  }
)
