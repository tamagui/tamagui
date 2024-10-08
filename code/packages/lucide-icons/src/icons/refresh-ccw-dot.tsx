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
      <Path d="M3 2v6h6" stroke={color} />
      <Path d="M21 12A9 9 0 0 0 6 5.3L3 8" stroke={color} />
      <Path d="M21 22v-6h-6" stroke={color} />
      <Path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" stroke={color} />
      <_Circle cx="12" cy="12" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RefreshCcwDot'

export const RefreshCcwDot = memo<IconProps>(themed(Icon))
