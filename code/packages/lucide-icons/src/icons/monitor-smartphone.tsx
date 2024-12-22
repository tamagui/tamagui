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
      <Path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" stroke={color} />
      <Path d="M10 19v-3.96 3.15" stroke={color} />
      <Path d="M7 19h5" stroke={color} />
      <Rect width="6" height="10" x="16" y="12" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MonitorSmartphone'

export const MonitorSmartphone = memo<IconProps>(themed(Icon))
