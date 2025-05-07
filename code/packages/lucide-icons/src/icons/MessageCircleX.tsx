import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const MessageCircleX: IconComponent = themed(
  memo(function MessageCircleX(props: IconProps) {
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
        <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" stroke={color} />
        <Path d="m15 9-6 6" stroke={color} />
        <Path d="m9 9 6 6" stroke={color} />
      </Svg>
    )
  })
)
