// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const BanknoteX: IconComponent = themed(
  memo(function BanknoteX(props: IconProps) {
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
          d="M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5"
          stroke={color}
        />
        <Path d="m17 17 5 5" stroke={color} />
        <Path d="M18 12h.01" stroke={color} />
        <Path d="m22 17-5 5" stroke={color} />
        <Path d="M6 12h.01" stroke={color} />
        <_Circle cx="12" cy="12" r="2" stroke={color} />
      </Svg>
    )
  })
)
