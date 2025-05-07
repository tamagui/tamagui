import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const CircleParkingOff: IconComponent = themed(
  memo(function CircleParkingOff(props: IconProps) {
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
        <_Circle cx="12" cy="12" r="10" stroke={color} />
        <Path d="m5 5 14 14" stroke={color} />
        <Path d="M13 13a3 3 0 1 0 0-6H9v2" stroke={color} />
        <Path d="M9 17v-2.34" stroke={color} />
      </Svg>
    )
  })
)
