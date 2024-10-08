import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="m19 3 1 1" stroke={color} />
      <Path d="m20 2-4.5 4.5" stroke={color} />
      <Path d="M20 8v13a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" stroke={color} />
      <Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H14" stroke={color} />
      <_Circle cx="14" cy="8" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BookKey'

export const BookKey = memo<IconProps>(themed(Icon))
