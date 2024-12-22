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
      <Path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" stroke={color} />
      <Path d="M4 6h.01" stroke={color} />
      <Path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" stroke={color} />
      <Path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" stroke={color} />
      <Path d="M12 18h.01" stroke={color} />
      <Path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" stroke={color} />
      <_Circle cx="12" cy="12" r="2" stroke={color} />
      <Path d="m13.41 10.59 5.66-5.66" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Radar'

export const Radar = memo<IconProps>(themed(Icon))
