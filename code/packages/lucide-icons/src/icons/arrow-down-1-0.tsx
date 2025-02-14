import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <Path d="m3 16 4 4 4-4" stroke={color} />
      <Path d="M7 20V4" stroke={color} />
      <Path d="M17 10V4h-2" stroke={color} />
      <Path d="M15 10h4" stroke={color} />
      <Rect x="15" y="14" width="4" height="6" ry="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowDown10'

export const ArrowDown10: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
