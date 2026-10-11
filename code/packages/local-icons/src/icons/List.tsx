import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const List: (props: IconProps) => JSX.Element = themed(
  memo(function List(props: IconProps) {
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
        <Path d="M3 5h.01" stroke={color} />
        <Path d="M3 12h.01" stroke={color} />
        <Path d="M3 19h.01" stroke={color} />
        <Path d="M8 5h13" stroke={color} />
        <Path d="M8 12h13" stroke={color} />
        <Path d="M8 19h13" stroke={color} />
      </Svg>
    )
  })
)
