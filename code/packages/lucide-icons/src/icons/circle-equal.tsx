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
      <Path d="M7 10h10" stroke={color} />
      <Path d="M7 14h10" stroke={color} />
      <_Circle cx="12" cy="12" r="10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleEqual'

export const CircleEqual = memo<IconProps>(themed(Icon))
