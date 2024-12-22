import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" stroke={color} />
      <_Circle cx="12" cy="12" r="2" stroke={color} />
      <Path d="M13.4 10.6 19 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleGauge'

export const CircleGauge = memo<IconProps>(themed(Icon))
