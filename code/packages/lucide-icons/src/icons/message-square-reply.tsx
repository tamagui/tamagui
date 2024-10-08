import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={color}
      />
      <Path d="m10 7-3 3 3 3" stroke={color} />
      <Path d="M17 13v-1a2 2 0 0 0-2-2H7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareReply'

export const MessageSquareReply = memo<IconProps>(themed(Icon))
