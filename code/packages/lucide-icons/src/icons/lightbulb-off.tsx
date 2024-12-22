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
      <Path d="M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5" stroke={color} />
      <Path d="M9 18h6" stroke={color} />
      <Path d="M10 22h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LightbulbOff'

export const LightbulbOff = memo<IconProps>(themed(Icon))
