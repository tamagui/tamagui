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
      <Rect width="20" height="16" x="2" y="4" rx="2" stroke={color} />
      <Path d="M6 8h.01" stroke={color} />
      <Path d="M10 8h.01" stroke={color} />
      <Path d="M14 8h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AppWindowMac'

export const AppWindowMac = memo<IconProps>(themed(Icon))
