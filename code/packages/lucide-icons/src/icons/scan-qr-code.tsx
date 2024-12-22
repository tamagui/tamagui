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
      <Path d="M17 12v4a1 1 0 0 1-1 1h-4" stroke={color} />
      <Path d="M17 3h2a2 2 0 0 1 2 2v2" stroke={color} />
      <Path d="M17 8V7" stroke={color} />
      <Path d="M21 17v2a2 2 0 0 1-2 2h-2" stroke={color} />
      <Path d="M3 7V5a2 2 0 0 1 2-2h2" stroke={color} />
      <Path d="M7 17h.01" stroke={color} />
      <Path d="M7 21H5a2 2 0 0 1-2-2v-2" stroke={color} />
      <Rect x="7" y="7" width="5" height="5" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ScanQrCode'

export const ScanQrCode = memo<IconProps>(themed(Icon))
