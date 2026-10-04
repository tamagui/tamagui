import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Coins: (props: IconProps) => JSX.Element = themed(
  memo(function Coins(props: IconProps) {
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
        <Path d="M13.744 17.736a6 6 0 1 1-7.48-7.48" stroke={color} />
        <Path d="M15 6h1v4" stroke={color} />
        <Path d="m6.134 14.768.866-.5 2 3.464" stroke={color} />
        <Circle cx="16" cy="8" r="6" stroke={color} />
      </Svg>
    )
  })
)
