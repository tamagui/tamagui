import React, { memo } from 'react'
import { View } from 'react-native'

import { useTheme } from '../hooks/useTheme'
import { StackProps } from '../StackProps'
import { HStack, VStack } from './Stacks'

export const Divider = memo(
  ({
    flex,
    vertical,
    height,
    width,
    opacity,
    flexLine = 10,
    noGap,
    ...rest
  }: Omit<StackProps, 'flex'> & {
    flexLine?: number
    flex?: boolean
    vertical?: boolean
    noGap?: boolean
  }) => {
    const theme = useTheme()
    return (
      <HStack
        flexDirection={vertical ? 'column' : 'row'}
        flex={flex === true ? 1 : 0}
        width={vertical ? 1 : flex ? 'auto' : '100%'}
        height={!vertical ? 1 : flex ? 'auto' : '100%'}
        {...(width && { width })}
        {...(height && { height })}
        {...rest}
      >
        {!noGap && <VStack flex={1} />}
        <VStack
          backgroundColor={theme.bg2}
          opacity={1}
          flex={flexLine}
          height={1}
          {...(vertical && {
            height: 'auto',
            width: 1,
          })}
          {...rest}
        />
        {!noGap && <VStack flex={1} />}
      </HStack>
    )
  }
)

export const HorizontalLine = () => {
  return (
    <View
      style={{
        height: 1,
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.06)',
      }}
    />
  )
}
