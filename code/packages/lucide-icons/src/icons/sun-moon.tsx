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
      <Path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" stroke={color} />
      <Path d="M12 2v2" stroke={color} />
      <Path d="M12 20v2" stroke={color} />
      <Path d="m4.9 4.9 1.4 1.4" stroke={color} />
      <Path d="m17.7 17.7 1.4 1.4" stroke={color} />
      <Path d="M2 12h2" stroke={color} />
      <Path d="M20 12h2" stroke={color} />
      <Path d="m6.3 17.7-1.4 1.4" stroke={color} />
      <Path d="m19.1 4.9-1.4 1.4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SunMoon'

export const SunMoon = memo<IconProps>(themed(Icon))
