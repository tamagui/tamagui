import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Path
        d="M15 2c-1.35 1.5-2.092 3-2.5 4.5M9 22c1.35-1.5 2.092-3 2.5-4.5"
        stroke={color}
      />
      <Path
        d="M2 15c3.333-3 6.667-3 10-3m10-3c-1.5 1.35-3 2.092-4.5 2.5"
        stroke={color}
      />
      <Path d="m17 6-2.5-2.5" stroke={color} />
      <Path d="m14 8-1.5-1.5" stroke={color} />
      <Path d="m7 18 2.5 2.5" stroke={color} />
      <Path d="m3.5 14.5.5.5" stroke={color} />
      <Path d="m20 9 .5.5" stroke={color} />
      <Path d="m6.5 12.5 1 1" stroke={color} />
      <Path d="m16.5 10.5 1 1" stroke={color} />
      <Path d="m10 16 1.5 1.5" stroke={color} />
      <Line x1="2" x2="22" y1="2" y2="22" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'DnaOff'

export const DnaOff = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
