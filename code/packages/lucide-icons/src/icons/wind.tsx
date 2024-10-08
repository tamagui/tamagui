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
      <Path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" stroke={color} />
      <Path d="M9.6 4.6A2 2 0 1 1 11 8H2" stroke={color} />
      <Path d="M12.6 19.4A2 2 0 1 0 14 16H2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Wind'

export const Wind = memo<IconProps>(themed(Icon))
