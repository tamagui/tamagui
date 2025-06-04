// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ParkingMeter: IconComponent = themed(
  memo(function ParkingMeter(props: IconProps) {
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
        <Path d="M11 15h2" stroke={color} />
        <Path d="M12 12v3" stroke={color} />
        <Path d="M12 19v3" stroke={color} />
        <Path
          d="M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z"
          stroke={color}
        />
        <Path d="M9 9a3 3 0 1 1 6 0" stroke={color} />
      </Svg>
    )
  })
)
