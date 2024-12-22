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
      <Rect width="8" height="6" x="5" y="4" rx="1" stroke={color} />
      <Rect width="8" height="6" x="11" y="14" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Ungroup'

export const Ungroup = memo<IconProps>(themed(Icon))
