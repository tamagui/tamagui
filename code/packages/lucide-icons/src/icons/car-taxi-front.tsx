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
      <Path d="M10 2h4" stroke={color} />
      <Path
        d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"
        stroke={color}
      />
      <Path d="M7 14h.01" stroke={color} />
      <Path d="M17 14h.01" stroke={color} />
      <Rect width="18" height="8" x="3" y="10" rx="2" stroke={color} />
      <Path d="M5 18v2" stroke={color} />
      <Path d="M19 18v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CarTaxiFront'

export const CarTaxiFront = memo<IconProps>(themed(Icon))
