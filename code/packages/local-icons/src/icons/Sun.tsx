import { memo, type JSX } from 'react'
import { Svg, Circle, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Sun: (props: IconProps) => JSX.Element = themed(
  memo(function Sun(props: IconProps) {
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
        <Circle cx="12" cy="12" r="4" stroke={color} />
        <Path d="M12 2v2" stroke={color} />
        <Path d="M12 20v2" stroke={color} />
        <Path d="m4.93 4.93 1.41 1.41" stroke={color} />
        <Path d="m17.66 17.66 1.41 1.41" stroke={color} />
        <Path d="M2 12h2" stroke={color} />
        <Path d="M20 12h2" stroke={color} />
        <Path d="m6.34 17.66-1.41 1.41" stroke={color} />
        <Path d="m19.07 4.93-1.41 1.41" stroke={color} />
      </Svg>
    )
  })
)
