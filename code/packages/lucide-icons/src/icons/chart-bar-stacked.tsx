import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Path d="M11 13v4" stroke={color} />
      <Path d="M15 5v4" stroke={color} />
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
      <Rect x="7" y="13" width="9" height="4" rx="1" stroke={color} />
      <Rect x="7" y="5" width="12" height="4" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartBarStacked'

export const ChartBarStacked = memo<IconProps>(themed(Icon))
