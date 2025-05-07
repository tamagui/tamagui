import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const WindArrowDown: IconComponent = themed(
  memo(function WindArrowDown(props: IconProps) {
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
        <Path d="M10 2v8" stroke={color} />
        <Path d="M12.8 21.6A2 2 0 1 0 14 18H2" stroke={color} />
        <Path d="M17.5 10a2.5 2.5 0 1 1 2 4H2" stroke={color} />
        <Path d="m6 6 4 4 4-4" stroke={color} />
      </Svg>
    )
  })
)
