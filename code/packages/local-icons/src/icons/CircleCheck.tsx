import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const CircleCheck: (props: IconProps) => JSX.Element = themed(
  memo(function CircleCheck(props: IconProps) {
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
        <Circle cx="12" cy="12" r="10" stroke={color} />
        <Path d="m16 9-5.5 5.5L8 12" stroke={color} />
      </Svg>
    )
  })
)
