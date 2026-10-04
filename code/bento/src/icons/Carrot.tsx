import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Carrot: (props: IconProps) => JSX.Element = themed(
  memo(function Carrot(props: IconProps) {
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
        <Path d="M15 16a1 1 0 0 0-7-7q-4 4-5.987 12.385a.5.5 0 0 0 .602.602Q11 20 15 16l-3-3" stroke={color} />
        <Path d="M15 9q4 4 7 0-3-4-7 0 4-4 0-7-4 3 0 7" stroke={color} />
        <Path d="m8 15-2.58-2.58" stroke={color} />
      </Svg>
    )
  })
)
