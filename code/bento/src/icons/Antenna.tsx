import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Antenna: (props: IconProps) => JSX.Element = themed(
  memo(function Antenna(props: IconProps) {
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
        <Path d="M2 12 7 2" stroke={color} />
        <Path d="m7 12 5-10" stroke={color} />
        <Path d="m12 12 5-10" stroke={color} />
        <Path d="m17 12 5-10" stroke={color} />
        <Path d="M4.5 7h15" stroke={color} />
        <Path d="M12 16v6" stroke={color} />
      </Svg>
    )
  })
)
