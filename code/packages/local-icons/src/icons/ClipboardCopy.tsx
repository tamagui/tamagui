import { memo, type JSX } from 'react'
import { Svg, Path, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ClipboardCopy: (props: IconProps) => JSX.Element = themed(
  memo(function ClipboardCopy(props: IconProps) {
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
        <Rect width="8" height="4" x="8" y="2" rx="1" ry="1" stroke={color} />
        <Path
          d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          stroke={color}
        />
        <Path d="M16 4h2a2 2 0 0 1 2 2v4" stroke={color} />
        <Path d="M21 14H11" stroke={color} />
        <Path d="m15 10-4 4 4 4" stroke={color} />
      </Svg>
    )
  })
)
