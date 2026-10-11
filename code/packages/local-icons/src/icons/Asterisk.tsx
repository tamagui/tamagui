import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Asterisk: (props: IconProps) => JSX.Element = themed(
  memo(function Asterisk(props: IconProps) {
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
        <Path d="M12 5v14" stroke={color} />
        <Path d="m18.065 8.496-12.125 7" stroke={color} />
        <Path d="m5.94 8.504 12.125 7" stroke={color} />
      </Svg>
    )
  })
)
