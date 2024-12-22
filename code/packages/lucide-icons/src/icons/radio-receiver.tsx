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
      <Path d="M5 16v2" stroke={color} />
      <Path d="M19 16v2" stroke={color} />
      <Rect width="20" height="8" x="2" y="8" rx="2" stroke={color} />
      <Path d="M18 12h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RadioReceiver'

export const RadioReceiver = memo<IconProps>(themed(Icon))
