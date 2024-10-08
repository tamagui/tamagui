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
      <Path
        d="M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197"
        stroke={color}
      />
      <Path d="M11 20v2" stroke={color} />
      <Path d="M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" stroke={color} />
      <Path d="M7 19v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CloudMoonRain'

export const CloudMoonRain = memo<IconProps>(themed(Icon))
