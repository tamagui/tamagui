import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path, Rect } from 'react-native-svg'
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
      <Path d="M3 6h3" stroke={color} />
      <Path d="M17 6h.01" stroke={color} />
      <Rect width="18" height="20" x="3" y="2" rx="2" stroke={color} />
      <_Circle cx="12" cy="13" r="5" stroke={color} />
      <Path d="M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'WashingMachine'

export const WashingMachine = memo<IconProps>(themed(Icon))
