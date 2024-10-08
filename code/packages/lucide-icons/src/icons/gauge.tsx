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
      <Path d="m12 14 4-4" stroke={color} />
      <Path d="M3.34 19a10 10 0 1 1 17.32 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Gauge'

export const Gauge = memo<IconProps>(themed(Icon))
