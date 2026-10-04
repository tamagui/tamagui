import { memo, type JSX } from 'react'
import { Svg, Line, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Hash: (props: IconProps) => JSX.Element = themed(
  memo(function Hash(props: IconProps) {
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
        <Line x1="4" x2="20" y1="9" y2="9" stroke={color} />
        <Line x1="4" x2="20" y1="15" y2="15" stroke={color} />
        <Line x1="10" x2="8" y1="3" y2="21" stroke={color} />
        <Line x1="16" x2="14" y1="3" y2="21" stroke={color} />
      </Svg>
    )
  })
)
