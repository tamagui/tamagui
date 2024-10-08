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
      <Polyline points="15 14 20 9 15 4" stroke={color} />
      <Path d="M4 20v-7a4 4 0 0 1 4-4h12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CornerUpRight'

export const CornerUpRight = memo<IconProps>(themed(Icon))
