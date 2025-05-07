import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ListFilterPlus: IconComponent = themed(
  memo(function ListFilterPlus(props: IconProps) {
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
        <Path d="M10 18h4" stroke={color} />
        <Path d="M11 6H3" stroke={color} />
        <Path d="M15 6h6" stroke={color} />
        <Path d="M18 9V3" stroke={color} />
        <Path d="M7 12h8" stroke={color} />
      </Svg>
    )
  })
)
