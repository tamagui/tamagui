import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path d="M14 22v-4a2 2 0 1 0-4 0v4" stroke={color} />
      <Path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" stroke={color} />
      <Path d="M18 5v17" stroke={color} />
      <Path d="m4 6 8-4 8 4" stroke={color} />
      <Path d="M6 5v17" stroke={color} />
      <_Circle cx="12" cy="9" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'School'

export const School = memo<IconProps>(themed(Icon))
