import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Rect width="20" height="15" x="2" y="4" rx="2" stroke={color} />
      <Rect width="8" height="7" x="6" y="8" rx="1" stroke={color} />
      <Path d="M18 8v7" stroke={color} />
      <Path d="M6 19v2" stroke={color} />
      <Path d="M18 19v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Microwave'

export const Microwave = memo<IconProps>(themed(Icon))
