import React, { memo } from 'react'
import { View } from 'react-native'

import { HStack, StackProps, VStack } from './Stacks'

export const Divider = memo(
  ({
    flex,
    vertical,
    height,
    width,
    opacity,
    flexLine = 10,
    backgroundColor,
    noGap,
    ...rest
  }: Omit<StackProps, 'flex'> & {
    flexLine?: number
    flex?: boolean
    vertical?: boolean
    noGap?: boolean
  }) => {
    return (
      <HStack
        flexDirection={vertical ? 'column' : 'row'}
        flex={flex === true ? 1 : 0}
        width={width ?? (vertical ? 1 : flex ? 'auto' : '100%')}
        height={height ?? (!vertical ? 1 : flex ? 'auto' : '100%')}
        {...rest}
      >
        {!noGap && <VStack flex={1} />}
        <View
          style={{
            [vertical ? 'width' : 'height']: 1,
            flex: flexLine,
            backgroundColor: backgroundColor ?? 'rgba(150,150,150,0.1)',
            opacity: opacity ?? 1,
          }}
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
