import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const AlignRight: (props: IconProps) => JSX.Element = themed(
  memo(function AlignRight(props: IconProps) {
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
        <Path d="M21 12H9" stroke={color} />
        <Path d="M21 19H7" stroke={color} />
      </Svg>
    )
  })
)
