import React from 'react'
import type { FontSizeTokens, TextProps} from 'tamagui';
import { Text, getConfig, getVariableValue } from 'tamagui'

export const NotoIcon = ({
  size: sizeProp = '$4',
  children,
  className,
  ...props
}: TextProps & {
  size?: FontSizeTokens | number
  children?: any
  className?: string
}) => {
  const conf = getConfig()
  const sizeNum =
    typeof sizeProp === 'number'
      ? sizeProp
      : conf.fonts.noto?.size[sizeProp.slice(1)] || 44
  const size = getVariableValue(sizeNum)
  return (
    <Text
      userSelect="none"
      pointerEvents="none"
      className={className}
      cursor="default"
      // fontFamily="$noto"
      fontSize={size}
      width={size * 1.25}
      height={size * 1.175}
      {...props}
    >
      {children}
    </Text>
  )
}
