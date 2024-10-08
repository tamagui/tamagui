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
      <Path d="M3 3h18" stroke={color} />
      <Path d="M20 7H8" stroke={color} />
      <Path d="M20 11H8" stroke={color} />
      <Path d="M10 19h10" stroke={color} />
      <Path d="M8 15h12" stroke={color} />
      <Path d="M4 3v14" stroke={color} />
      <_Circle cx="4" cy="19" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Blinds'

export const Blinds = memo<IconProps>(themed(Icon))
