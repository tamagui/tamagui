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
      <Path d="M3 3v18h18" stroke={color} />
      <Rect width="4" height="7" x="7" y="10" rx="1" stroke={color} />
      <Rect width="4" height="12" x="15" y="5" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BarChartBig'

export const BarChartBig = memo<IconProps>(themed(Icon))
