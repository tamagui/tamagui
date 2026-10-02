import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const AlignLeft: (props: IconProps) => JSX.Element = themed(
  memo(function AlignLeft(props: IconProps) {
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
        <Path d="M21 5H3" stroke={color} />
        <Path d="M15 12H3" stroke={color} />
        <Path d="M17 19H3" stroke={color} />
      </Svg>
    )
  })
)
