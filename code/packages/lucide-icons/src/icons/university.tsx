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
      <_Circle cx="12" cy="10" r="1" stroke={color} />
      <Path d="M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2" stroke={color} />
      <Path d="M6 17v.01" stroke={color} />
      <Path d="M6 13v.01" stroke={color} />
      <Path d="M18 17v.01" stroke={color} />
      <Path d="M18 13v.01" stroke={color} />
      <Path d="M14 22v-5a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'University'

export const University = memo<IconProps>(themed(Icon))
