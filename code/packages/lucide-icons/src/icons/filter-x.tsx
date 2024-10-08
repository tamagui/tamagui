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
      <Path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055" stroke={color} />
      <Path d="m22 3-5 5" stroke={color} />
      <Path d="m17 3 5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FilterX'

export const FilterX = memo<IconProps>(themed(Icon))
