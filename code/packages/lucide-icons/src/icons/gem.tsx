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
      <Path d="M6 3h12l4 6-10 13L2 9Z" stroke={color} />
      <Path d="M11 3 8 9l4 13 4-13-3-6" stroke={color} />
      <Path d="M2 9h20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Gem'

export const Gem = memo<IconProps>(themed(Icon))
