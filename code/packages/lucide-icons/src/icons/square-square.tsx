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
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} />
      <Rect x="8" y="8" width="8" height="8" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareSquare'

export const SquareSquare = memo<IconProps>(themed(Icon))
