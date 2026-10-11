import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const CheckCircle: (props: IconProps) => JSX.Element = themed(
  memo(function CheckCircle(props: IconProps) {
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
        <Path d="M21.801 10A10 10 0 1 1 17 3.335" stroke={color} />
        <Path d="m9 11 3 3L22 4" stroke={color} />
      </Svg>
    )
  })
)
