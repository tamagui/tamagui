import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const BetweenHorizontalEnd: IconComponent = themed(
  memo(function BetweenHorizontalEnd(props: IconProps) {
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
        <Rect width="13" height="7" x="3" y="3" rx="1" stroke={color} />
        <Path d="m22 15-3-3 3-3" stroke={color} />
        <Rect width="13" height="7" x="3" y="14" rx="1" stroke={color} />
      </Svg>
    )
  })
)
