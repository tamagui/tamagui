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
      <Path d="M12 2v2" stroke={color} />
      <Path d="m4.93 4.93 1.41 1.41" stroke={color} />
      <Path d="M20 12h2" stroke={color} />
      <Path d="m19.07 4.93-1.41 1.41" stroke={color} />
      <Path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" stroke={color} />
      <Path d="M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" stroke={color} />
      <Path d="M11 20v2" stroke={color} />
      <Path d="M7 19v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CloudSunRain'

export const CloudSunRain = memo<IconProps>(themed(Icon))
