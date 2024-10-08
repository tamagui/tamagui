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
      <Path d="M10 6h8" stroke={color} />
      <Path d="M12 16h6" stroke={color} />
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
      <Path d="M8 11h7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartGantt'

export const ChartGantt = memo<IconProps>(themed(Icon))
