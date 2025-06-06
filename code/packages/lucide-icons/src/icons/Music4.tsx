// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Music4: IconComponent = themed(
  memo(function Music4(props: IconProps) {
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
        <Path d="M9 18V5l12-2v13" stroke={color} />
        <Path d="m9 9 12-2" stroke={color} />
        <_Circle cx="6" cy="18" r="3" stroke={color} />
        <_Circle cx="18" cy="16" r="3" stroke={color} />
      </Svg>
    )
  })
)
