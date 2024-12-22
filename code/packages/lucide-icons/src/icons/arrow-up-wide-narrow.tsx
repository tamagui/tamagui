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
      <Path d="m3 8 4-4 4 4" stroke={color} />
      <Path d="M7 4v16" stroke={color} />
      <Path d="M11 12h10" stroke={color} />
      <Path d="M11 16h7" stroke={color} />
      <Path d="M11 20h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpWideNarrow'

export const ArrowUpWideNarrow = memo<IconProps>(themed(Icon))
