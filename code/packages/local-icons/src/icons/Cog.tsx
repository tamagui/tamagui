import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Cog: (props: IconProps) => JSX.Element = themed(
  memo(function Cog(props: IconProps) {
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
        <Path d="M11 10.27 7 3.34" stroke={color} />
        <Path d="m11 13.73-4 6.93" stroke={color} />
        <Path d="M12 22v-2" stroke={color} />
        <Path d="M12 2v2" stroke={color} />
        <Path d="M14 12h8" stroke={color} />
        <Path d="m17 20.66-1-1.73" stroke={color} />
        <Path d="m17 3.34-1 1.73" stroke={color} />
        <Path d="M2 12h2" stroke={color} />
        <Path d="m20.66 17-1.73-1" stroke={color} />
        <Path d="m20.66 7-1.73 1" stroke={color} />
        <Path d="m3.34 17 1.73-1" stroke={color} />
        <Path d="m3.34 7 1.73 1" stroke={color} />
        <Circle cx="12" cy="12" r="2" stroke={color} />
        <Circle cx="12" cy="12" r="8" stroke={color} />
      </Svg>
    )
  })
)
