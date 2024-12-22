import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="m3 16 4 4 4-4" stroke={color} />
      <Path d="M7 4v16" stroke={color} />
      <Path d="M15 4h5l-5 6h5" stroke={color} />
      <Path d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" stroke={color} />
      <Path d="M20 18h-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowDownZA'

export const ArrowDownZA = memo<IconProps>(themed(Icon))
