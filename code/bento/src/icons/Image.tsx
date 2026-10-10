import { memo, type JSX } from 'react'
import { Svg, Circle, Path, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Image: (props: IconProps) => JSX.Element = themed(
  memo(function Image(props: IconProps) {
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
        <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke={color} />
        <Circle cx="9" cy="9" r="2" stroke={color} />
        <Path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke={color} />
      </Svg>
    )
  })
)
