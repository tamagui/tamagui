import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Anchor: (props: IconProps) => JSX.Element = themed(
  memo(function Anchor(props: IconProps) {
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
        <Path d="M12 6v16" stroke={color} />
        <Path d="m19 13 2-1a9 9 0 0 1-18 0l2 1" stroke={color} />
        <Path d="M9 11h6" stroke={color} />
        <Circle cx="12" cy="4" r="2" stroke={color} />
      </Svg>
    )
  })
)
