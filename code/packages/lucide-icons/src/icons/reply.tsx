import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Polyline } from 'react-native-svg'
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
      <Polyline points="9 17 4 12 9 7" stroke={color} />
      <Path d="M20 18v-2a4 4 0 0 0-4-4H4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Reply'

export const Reply = memo<IconProps>(themed(Icon))
