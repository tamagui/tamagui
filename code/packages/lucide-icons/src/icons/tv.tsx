import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Polyline, Rect } from 'react-native-svg'
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
      <Rect width="20" height="15" x="2" y="7" rx="2" ry="2" stroke={color} />
      <Polyline points="17 2 12 7 7 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Tv'

export const Tv = memo<IconProps>(themed(Icon))
