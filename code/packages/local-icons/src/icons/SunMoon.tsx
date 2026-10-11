import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const SunMoon: (props: IconProps) => JSX.Element = themed(
  memo(function SunMoon(props: IconProps) {
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
        <Path d="M12 2v2" stroke={color} />
        <Path
          d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"
          stroke={color}
        />
        <Path d="M16 12a4 4 0 0 0-4-4" stroke={color} />
        <Path d="m19 5-1.256 1.256" stroke={color} />
        <Path d="M20 12h2" stroke={color} />
      </Svg>
    )
  })
)
