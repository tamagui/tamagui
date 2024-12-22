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
      <Path d="M17 6H3" stroke={color} />
      <Path d="M21 12H8" stroke={color} />
      <Path d="M21 18H8" stroke={color} />
      <Path d="M3 12v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TextQuote'

export const TextQuote = memo<IconProps>(themed(Icon))
