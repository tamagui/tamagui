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
      <Rect width="7" height="7" x="3" y="3" rx="1" stroke={color} />
      <Rect width="7" height="7" x="3" y="14" rx="1" stroke={color} />
      <Path d="M14 4h7" stroke={color} />
      <Path d="M14 9h7" stroke={color} />
      <Path d="M14 15h7" stroke={color} />
      <Path d="M14 20h7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LayoutList'

export const LayoutList = memo<IconProps>(themed(Icon))
