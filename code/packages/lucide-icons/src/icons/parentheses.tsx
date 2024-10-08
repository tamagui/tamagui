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
      <Path d="M8 21s-4-3-4-9 4-9 4-9" stroke={color} />
      <Path d="M16 3s4 3 4 9-4 9-4 9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Parentheses'

export const Parentheses = memo<IconProps>(themed(Icon))
