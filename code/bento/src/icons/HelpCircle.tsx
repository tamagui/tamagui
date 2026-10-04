import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const HelpCircle: (props: IconProps) => JSX.Element = themed(
  memo(function HelpCircle(props: IconProps) {
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
        <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} />
        <Path d="M12 17h.01" stroke={color} />
      </Svg>
    )
  })
)
