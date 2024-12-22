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
      <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      <Path d="M7 3v18" stroke={color} />
      <Path d="M3 7.5h4" stroke={color} />
      <Path d="M3 12h18" stroke={color} />
      <Path d="M3 16.5h4" stroke={color} />
      <Path d="M17 3v18" stroke={color} />
      <Path d="M17 7.5h4" stroke={color} />
      <Path d="M17 16.5h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Film'

export const Film = memo<IconProps>(themed(Icon))
