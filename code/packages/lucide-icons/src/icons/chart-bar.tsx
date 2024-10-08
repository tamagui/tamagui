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
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" stroke={color} />
      <Path d="M7 16h8" stroke={color} />
      <Path d="M7 11h12" stroke={color} />
      <Path d="M7 6h3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChartBar'

export const ChartBar = memo<IconProps>(themed(Icon))
