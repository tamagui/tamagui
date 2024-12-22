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
      <Rect width="20" height="16" x="2" y="4" rx="2" stroke={color} />
      <Path d="M2 14h20" stroke={color} />
      <Path d="M12 20v-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Touchpad'

export const Touchpad = memo<IconProps>(themed(Icon))
