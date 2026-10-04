import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const SunDim: (props: IconProps) => JSX.Element = themed(
  memo(function SunDim(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props as SvgProps & {
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
        <Circle cx="12" cy="12" r="4" stroke={color} />
        <Path d="M12 4h.01" stroke={color} />
        <Path d="M20 12h.01" stroke={color} />
        <Path d="M12 20h.01" stroke={color} />
        <Path d="M4 12h.01" stroke={color} />
        <Path d="M17.657 6.343h.01" stroke={color} />
        <Path d="M17.657 17.657h.01" stroke={color} />
        <Path d="M6.343 17.657h.01" stroke={color} />
        <Path d="M6.343 6.343h.01" stroke={color} />
      </Svg>
    )
  })
)
