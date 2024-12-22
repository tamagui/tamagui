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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <Path d="M7 7h.01" stroke={color} />
      <Path d="M17 7h.01" stroke={color} />
      <Path d="M7 17h.01" stroke={color} />
      <Path d="M17 17h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'InspectionPanel'

export const InspectionPanel = memo<IconProps>(themed(Icon))
