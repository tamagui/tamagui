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
      <Path d="M15 2c-1.35 1.5-2.092 3-2.5 4.5L14 8" stroke={color} />
      <Path d="m17 6-2.891-2.891" stroke={color} />
      <Path d="M2 15c3.333-3 6.667-3 10-3" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="m20 9 .891.891" stroke={color} />
      <Path d="M22 9c-1.5 1.35-3 2.092-4.5 2.5l-1-1" stroke={color} />
      <Path d="M3.109 14.109 4 15" stroke={color} />
      <Path d="m6.5 12.5 1 1" stroke={color} />
      <Path d="m7 18 2.891 2.891" stroke={color} />
      <Path d="M9 22c1.35-1.5 2.092-3 2.5-4.5L10 16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'DnaOff'

export const DnaOff = memo<IconProps>(themed(Icon))
