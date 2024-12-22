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
      <Rect width="20" height="5" x="2" y="3" rx="1" stroke={color} />
      <Path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" stroke={color} />
      <Path d="M10 12h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Archive'

export const Archive = memo<IconProps>(themed(Icon))
