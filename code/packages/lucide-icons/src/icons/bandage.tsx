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
      <Path d="M10 10.01h.01" stroke={color} />
      <Path d="M10 14.01h.01" stroke={color} />
      <Path d="M14 10.01h.01" stroke={color} />
      <Path d="M14 14.01h.01" stroke={color} />
      <Path d="M18 6v11.5" stroke={color} />
      <Path d="M6 6v12" stroke={color} />
      <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bandage'

export const Bandage = memo<IconProps>(themed(Icon))
