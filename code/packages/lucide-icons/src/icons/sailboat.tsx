import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" stroke={color} />
      <Path d="M21 14 10 2 3 14h18Z" stroke={color} />
      <Path d="M10 2v16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sailboat'

export const Sailboat = memo<IconProps>(themed(Icon))
