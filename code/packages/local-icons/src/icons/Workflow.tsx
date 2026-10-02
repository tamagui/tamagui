import { memo, type JSX } from 'react'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Workflow: (props: IconProps) => JSX.Element = themed(
  memo(function Workflow(props: IconProps) {
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
        <Rect width="8" height="8" x="3" y="3" rx="2" stroke={color} />
        <Path d="M7 11v4a2 2 0 0 0 2 2h4" stroke={color} />
        <Rect width="8" height="8" x="13" y="13" rx="2" stroke={color} />
      </Svg>
    )
  })
)
