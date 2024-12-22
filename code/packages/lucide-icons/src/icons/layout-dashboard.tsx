import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Rect } from 'react-native-svg'
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
      <Rect width="7" height="9" x="3" y="3" rx="1" stroke={color} />
      <Rect width="7" height="5" x="14" y="3" rx="1" stroke={color} />
      <Rect width="7" height="9" x="14" y="12" rx="1" stroke={color} />
      <Rect width="7" height="5" x="3" y="16" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LayoutDashboard'

export const LayoutDashboard = memo<IconProps>(themed(Icon))
