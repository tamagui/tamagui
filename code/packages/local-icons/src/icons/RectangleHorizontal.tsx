import { memo, type JSX } from 'react'
import { Svg, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const RectangleHorizontal: (props: IconProps) => JSX.Element = themed(
  memo(function RectangleHorizontal(props: IconProps) {
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
        <Rect width="20" height="12" x="2" y="6" rx="2" stroke={color} />
      </Svg>
    )
  })
)
