import { memo, type JSX } from 'react'
import { Svg, Circle as _Circle } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Circle: (props: IconProps) => JSX.Element = themed(
  memo(function Circle(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props
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
        <_Circle cx="12" cy="12" r="10" stroke={color} />
      </Svg>
    )
  })
)
