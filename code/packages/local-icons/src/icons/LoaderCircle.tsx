import { memo, type JSX } from 'react'
import { Svg, Path } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const LoaderCircle: (props: IconProps) => JSX.Element = themed(
  memo(function LoaderCircle(props: IconProps) {
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
        <Path d="M21 12a9 9 0 1 1-6.219-8.56" stroke={color} />
      </Svg>
    )
  })
)
