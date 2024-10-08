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
      <Path d="M5 13a10 10 0 0 1 14 0" stroke={color} />
      <Path d="M8.5 16.5a5 5 0 0 1 7 0" stroke={color} />
      <Path d="M2 8.82a15 15 0 0 1 20 0" stroke={color} />
      <Line x1="12" x2="12.01" y1="20" y2="20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Wifi'

export const Wifi = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
