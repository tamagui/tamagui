import { memo, type JSX } from 'react'
import { Svg, Circle, Line, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Timer: (props: IconProps) => JSX.Element = themed(
  memo(function Timer(props: IconProps) {
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
        <Line x1="10" x2="14" y1="2" y2="2" stroke={color} />
        <Line x1="12" x2="15" y1="14" y2="11" stroke={color} />
        <Circle cx="12" cy="14" r="8" stroke={color} />
      </Svg>
    )
  })
)
