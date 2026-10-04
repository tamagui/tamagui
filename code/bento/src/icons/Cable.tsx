import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Cable: (props: IconProps) => JSX.Element = themed(
  memo(function Cable(props: IconProps) {
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
        <Path
          d="M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z"
          stroke={color}
        />
        <Path d="M17 21v-2" stroke={color} />
        <Path d="M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10" stroke={color} />
        <Path d="M21 21v-2" stroke={color} />
        <Path d="M3 5V3" stroke={color} />
        <Path
          d="M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z"
          stroke={color}
        />
        <Path d="M7 5V3" stroke={color} />
      </Svg>
    )
  })
)
