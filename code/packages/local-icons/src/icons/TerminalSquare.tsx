import { memo, type JSX } from 'react'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const TerminalSquare: (props: IconProps) => JSX.Element = themed(
  memo(function TerminalSquare(props: IconProps) {
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
        <Path d="m7 11 2-2-2-2" stroke={color} />
        <Path d="M11 13h4" stroke={color} />
        <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke={color} />
      </Svg>
    )
  })
)
