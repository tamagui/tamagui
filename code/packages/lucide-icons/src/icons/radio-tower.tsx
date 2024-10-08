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
      <Path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" stroke={color} />
      <Path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" stroke={color} />
      <_Circle cx="12" cy="9" r="2" stroke={color} />
      <Path d="M16.2 4.8c2 2 2.26 5.11.8 7.47" stroke={color} />
      <Path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1" stroke={color} />
      <Path d="M9.5 18h5" stroke={color} />
      <Path d="m8 22 4-11 4 11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RadioTower'

export const RadioTower = memo<IconProps>(themed(Icon))
