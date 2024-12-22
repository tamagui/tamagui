import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <_Circle cx="8" cy="8" r="6" stroke={color} />
      <Path d="M18.09 10.37A6 6 0 1 1 10.34 18" stroke={color} />
      <Path d="M7 6h1v4" stroke={color} />
      <Path d="m16.71 13.88.7.71-2.82 2.82" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Coins'

export const Coins = memo<IconProps>(themed(Icon))
