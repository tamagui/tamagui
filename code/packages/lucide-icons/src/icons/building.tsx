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
      <Rect width="16" height="20" x="4" y="2" rx="2" ry="2" stroke={color} />
      <Path d="M9 22v-4h6v4" stroke={color} />
      <Path d="M8 6h.01" stroke={color} />
      <Path d="M16 6h.01" stroke={color} />
      <Path d="M12 6h.01" stroke={color} />
      <Path d="M12 10h.01" stroke={color} />
      <Path d="M12 14h.01" stroke={color} />
      <Path d="M16 10h.01" stroke={color} />
      <Path d="M16 14h.01" stroke={color} />
      <Path d="M8 10h.01" stroke={color} />
      <Path d="M8 14h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Building'

export const Building = memo<IconProps>(themed(Icon))
