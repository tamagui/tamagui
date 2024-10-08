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
      <Rect width="14" height="20" x="5" y="2" rx="2" stroke={color} />
      <Path d="M15 14h.01" stroke={color} />
      <Path d="M9 6h6" stroke={color} />
      <Path d="M9 10h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PcCase'

export const PcCase = memo<IconProps>(themed(Icon))
