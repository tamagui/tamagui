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
      <Path d="m16 3 4 4-4 4" stroke={color} />
      <Path d="M20 7H4" stroke={color} />
      <Path d="m8 21-4-4 4-4" stroke={color} />
      <Path d="M4 17h16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowRightLeft'

export const ArrowRightLeft = memo<IconProps>(themed(Icon))
