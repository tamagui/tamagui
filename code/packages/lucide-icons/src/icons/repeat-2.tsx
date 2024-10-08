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
      <Path d="m2 9 3-3 3 3" stroke={color} />
      <Path d="M13 18H7a2 2 0 0 1-2-2V6" stroke={color} />
      <Path d="m22 15-3 3-3-3" stroke={color} />
      <Path d="M11 6h6a2 2 0 0 1 2 2v10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Repeat2'

export const Repeat2 = memo<IconProps>(themed(Icon))
