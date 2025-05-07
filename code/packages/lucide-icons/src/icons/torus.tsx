import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Ellipse } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Torus: IconComponent = themed(
  memo(function Torus(props: IconProps) {
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
        <Ellipse cx="12" cy="11" rx="3" ry="2" stroke={color} />
        <Ellipse cx="12" cy="12.5" rx="10" ry="8.5" stroke={color} />
      </Svg>
    )
  })
)
