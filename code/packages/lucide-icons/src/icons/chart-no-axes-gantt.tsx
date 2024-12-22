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
      <Path d="M8 6h10" stroke={color} />
      <Path d="M6 12h9" stroke={color} />
      <Path d="M11 18h7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartNoAxesGantt'

export const ChartNoAxesGantt = memo<IconProps>(themed(Icon))
