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
      <Rect width="18" height="7" x="3" y="3" rx="1" stroke={color} />
      <Rect width="9" height="7" x="3" y="14" rx="1" stroke={color} />
      <Rect width="5" height="7" x="16" y="14" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LayoutTemplate'

export const LayoutTemplate = memo<IconProps>(themed(Icon))
