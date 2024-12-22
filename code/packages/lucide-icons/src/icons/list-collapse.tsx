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
      <Path d="m3 10 2.5-2.5L3 5" stroke={color} />
      <Path d="m3 19 2.5-2.5L3 14" stroke={color} />
      <Path d="M10 6h11" stroke={color} />
      <Path d="M10 12h11" stroke={color} />
      <Path d="M10 18h11" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListCollapse'

export const ListCollapse = memo<IconProps>(themed(Icon))
