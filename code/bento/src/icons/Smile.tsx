import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Smile: (props: IconProps) => JSX.Element = themed(
  memo(function Smile(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props as SvgProps & {
      color?: string
      size?: number
    }
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
        <Path d="M15 10V9" stroke={color} />
        <Path d="M16.472 15a6 6 0 01-8.943 0" stroke={color} />
        <Path d="M9 10V9" stroke={color} />
        <Circle cx="12" cy="12" r="10" stroke={color} />
      </Svg>
    )
  })
)
