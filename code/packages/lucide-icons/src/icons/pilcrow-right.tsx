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
      <Path d="M10 3v11" stroke={color} />
      <Path d="M10 9H7a1 1 0 0 1 0-6h8" stroke={color} />
      <Path d="M14 3v11" stroke={color} />
      <Path d="m18 14 4 4H2" stroke={color} />
      <Path d="m22 18-4 4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PilcrowRight'

export const PilcrowRight = memo<IconProps>(themed(Icon))
