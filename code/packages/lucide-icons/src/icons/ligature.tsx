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
      <Path d="M8 20V8c0-2.2 1.8-4 4-4 1.5 0 2.8.8 3.5 2" stroke={color} />
      <Path d="M6 12h4" stroke={color} />
      <Path d="M14 12h2v8" stroke={color} />
      <Path d="M6 20h4" stroke={color} />
      <Path d="M14 20h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Ligature'

export const Ligature = memo<IconProps>(themed(Icon))
