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
      <Polyline points="15 10 20 15 15 20" stroke={color} />
      <Path d="M4 4v7a4 4 0 0 0 4 4h12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CornerDownRight'

export const CornerDownRight = memo<IconProps>(themed(Icon))
