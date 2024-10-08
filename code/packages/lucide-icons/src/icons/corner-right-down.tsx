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
      <Polyline points="10 15 15 20 20 15" stroke={color} />
      <Path d="M4 4h7a4 4 0 0 1 4 4v12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CornerRightDown'

export const CornerRightDown = memo<IconProps>(themed(Icon))
