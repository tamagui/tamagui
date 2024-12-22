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
      <Rect width="7" height="13" x="3" y="3" rx="1" stroke={color} />
      <Path d="m9 22 3-3 3 3" stroke={color} />
      <Rect width="7" height="13" x="14" y="3" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BetweenVerticalEnd'

export const BetweenVerticalEnd = memo<IconProps>(themed(Icon))
