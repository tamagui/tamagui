import { memo, type JSX } from 'react'
import { Svg, Circle, Path, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const LockKeyhole: (props: IconProps) => JSX.Element = themed(
  memo(function LockKeyhole(props: IconProps) {
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
        <Circle cx="12" cy="16" r="1" stroke={color} />
        <Rect x="3" y="10" width="18" height="12" rx="2" stroke={color} />
        <Path d="M7 10V7a5 5 0 0 1 10 0v3" stroke={color} />
      </Svg>
    )
  })
)
