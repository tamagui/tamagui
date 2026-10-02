import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Waves: (props: IconProps) => JSX.Element = themed(
  memo(function Waves(props: IconProps) {
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
        <Path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" stroke={color} />
        <Path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" stroke={color} />
        <Path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" stroke={color} />
      </Svg>
    )
  })
)
