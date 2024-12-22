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
      <Path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" stroke={color} />
      <Path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" stroke={color} />
      <_Circle cx="12" cy="12" r="2" stroke={color} />
      <Path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" stroke={color} />
      <Path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Radio'

export const Radio = memo<IconProps>(themed(Icon))
