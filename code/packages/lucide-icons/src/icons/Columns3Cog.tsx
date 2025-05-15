// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Columns3Cog: IconComponent = themed(
  memo(function Columns3Cog(props: IconProps) {
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
          d="M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"
          stroke={color}
        />
        <Path d="m14.3 19.6 1-.4" stroke={color} />
        <Path d="M15 3v7.5" stroke={color} />
        <Path d="m15.2 16.9-.9-.3" stroke={color} />
        <Path d="m16.6 21.7.3-.9" stroke={color} />
        <Path d="m16.8 15.3-.4-1" stroke={color} />
        <Path d="m19.1 15.2.3-.9" stroke={color} />
        <Path d="m19.6 21.7-.4-1" stroke={color} />
        <Path d="m20.7 16.8 1-.4" stroke={color} />
        <Path d="m21.7 19.4-.9-.3" stroke={color} />
        <Path d="M9 3v18" stroke={color} />
        <_Circle cx="18" cy="18" r="3" stroke={color} />
      </Svg>
    )
  })
)
