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
      <Path d="M19 15v-2a2 2 0 1 0-4 0v2" stroke={color} />
      <Path d="M9 17H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5" stroke={color} />
      <Rect x="13" y="15" width="8" height="5" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareLock'

export const MessageSquareLock = memo<IconProps>(themed(Icon))
