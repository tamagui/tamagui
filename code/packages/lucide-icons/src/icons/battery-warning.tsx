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
      <Path d="M10 17h.01" stroke={color} />
      <Path d="M10 7v6" stroke={color} />
      <Path d="M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" stroke={color} />
      <Path d="M22 11v2" stroke={color} />
      <Path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BatteryWarning'

export const BatteryWarning = memo<IconProps>(themed(Icon))
