import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Trash: (props: IconProps) => JSX.Element = themed(
  memo(function Trash(props: IconProps) {
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
        <Path d="M10 11v6" stroke={color} />
        <Path d="M14 11v6" stroke={color} />
        <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke={color} />
        <Path d="M3 6h18" stroke={color} />
        <Path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={color} />
      </Svg>
    )
  })
)
