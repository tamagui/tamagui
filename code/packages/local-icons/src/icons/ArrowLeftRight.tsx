import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ArrowLeftRight: (props: IconProps) => JSX.Element = themed(
  memo(function ArrowLeftRight(props: IconProps) {
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
        <Path d="M8 3 4 7l4 4" stroke={color} />
        <Path d="M4 7h16" stroke={color} />
        <Path d="m16 21 4-4-4-4" stroke={color} />
        <Path d="M20 17H4" stroke={color} />
      </Svg>
    )
  })
)
