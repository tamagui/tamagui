import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Scale3d: IconComponent = themed(
  memo(function Scale3d(props: IconProps) {
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
        <Path d="M5 7v11a1 1 0 0 0 1 1h11" stroke={color} />
        <Path d="M5.293 18.707 11 13" stroke={color} />
        <_Circle cx="19" cy="19" r="2" stroke={color} />
        <_Circle cx="5" cy="5" r="2" stroke={color} />
      </Svg>
    )
  })
)
