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
      <Rect width="16" height="6" x="2" y="4" rx="2" stroke={color} />
      <Rect width="9" height="6" x="9" y="14" rx="2" stroke={color} />
      <Path d="M22 22V2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignEndVertical'

export const AlignEndVertical = memo<IconProps>(themed(Icon))
