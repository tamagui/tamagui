import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

const Icon = (props) => {
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
      <Path
        d="m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"
        stroke={color}
      />
      <Path d="M4.82 7.9 8 10" stroke={color} />
      <Path d="M15.18 7.9 12 10" stroke={color} />
      <Path d="M16.93 10H20a2 2 0 0 1 0 4H2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Turtle'

export const Turtle = memo<IconProps>(themed(Icon))
