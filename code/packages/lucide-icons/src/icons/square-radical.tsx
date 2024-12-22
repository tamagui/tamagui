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
      <Path d="M7 12h2l2 5 2-10h4" stroke={color} />
      <Rect x="3" y="3" width="18" height="18" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SquareRadical'

export const SquareRadical = memo<IconProps>(themed(Icon))
