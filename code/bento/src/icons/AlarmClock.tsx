import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const AlarmClock: (props: IconProps) => JSX.Element = themed(
  memo(function AlarmClock(props: IconProps) {
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
        <Circle cx="12" cy="13" r="8" stroke={color} />
        <Path d="M12 9v4l2 2" stroke={color} />
        <Path d="M5 3 2 6" stroke={color} />
        <Path d="m22 6-3-3" stroke={color} />
        <Path d="M6.38 18.7 4 21" stroke={color} />
        <Path d="M17.64 18.67 20 21" stroke={color} />
      </Svg>
    )
  })
)
