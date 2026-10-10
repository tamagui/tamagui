import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ArrowUpDown: (props: IconProps) => JSX.Element = themed(
  memo(function ArrowUpDown(props: IconProps) {
    const {
      color = 'black',
      size = 24,
      ...otherProps
    } = props as SvgProps & {
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
        <Path d="m21 16-4 4-4-4" stroke={color} />
        <Path d="M17 20V4" stroke={color} />
        <Path d="m3 8 4-4 4 4" stroke={color} />
        <Path d="M7 4v16" stroke={color} />
      </Svg>
    )
  })
)
