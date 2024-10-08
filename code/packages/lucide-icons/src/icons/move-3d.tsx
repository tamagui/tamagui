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
      <Path d="M5 3v16h16" stroke={color} />
      <Path d="m5 19 6-6" stroke={color} />
      <Path d="m2 6 3-3 3 3" stroke={color} />
      <Path d="m18 16 3 3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Move3d'

export const Move3d = memo<IconProps>(themed(Icon))
