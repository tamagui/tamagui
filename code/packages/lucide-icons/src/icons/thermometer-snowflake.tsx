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
      <Path d="M2 12h10" stroke={color} />
      <Path d="M9 4v16" stroke={color} />
      <Path d="m3 9 3 3-3 3" stroke={color} />
      <Path d="M12 6 9 9 6 6" stroke={color} />
      <Path d="m6 18 3-3 1.5 1.5" stroke={color} />
      <Path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ThermometerSnowflake'

export const ThermometerSnowflake = memo<IconProps>(themed(Icon))
