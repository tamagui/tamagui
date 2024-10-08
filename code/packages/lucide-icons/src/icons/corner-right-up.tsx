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
      <Polyline points="10 9 15 4 20 9" stroke={color} />
      <Path d="M4 20h7a4 4 0 0 0 4-4V4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CornerRightUp'

export const CornerRightUp = memo<IconProps>(themed(Icon))
