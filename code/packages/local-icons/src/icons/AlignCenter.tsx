import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const AlignCenter: (props: IconProps) => JSX.Element = themed(
  memo(function AlignCenter(props: IconProps) {
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
        <Path d="M21 5H3" stroke={color} />
        <Path d="M17 12H7" stroke={color} />
        <Path d="M19 19H5" stroke={color} />
      </Svg>
    )
  })
)
