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
      <Path d="M12 20V10" stroke={color} />
      <Path d="M18 20v-4" stroke={color} />
      <Path d="M6 20V4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartNoAxesColumnDecreasing'

export const ChartNoAxesColumnDecreasing = memo<IconProps>(themed(Icon))
