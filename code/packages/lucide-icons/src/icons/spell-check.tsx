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
      <Path d="m6 16 6-12 6 12" stroke={color} />
      <Path d="M8 12h8" stroke={color} />
      <Path d="m16 20 2 2 4-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SpellCheck'

export const SpellCheck = memo<IconProps>(themed(Icon))
