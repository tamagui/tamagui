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
      <Rect width="18" height="12" x="3" y="8" rx="1" stroke={color} />
      <Path d="M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3" stroke={color} />
      <Path d="M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ToyBrick'

export const ToyBrick = memo<IconProps>(themed(Icon))
