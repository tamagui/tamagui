import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const AirVent: IconComponent = themed(
  memo(function AirVent(props: IconProps) {
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
        <Path d="M18 17.5a2.5 2.5 0 1 1-4 2.03V12" stroke={color} />
        <Path
          d="M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
          stroke={color}
        />
        <Path d="M6 8h12" stroke={color} />
        <Path d="M6.6 15.572A2 2 0 1 0 10 17v-5" stroke={color} />
      </Svg>
    )
  })
)
