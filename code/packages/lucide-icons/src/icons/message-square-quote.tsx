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
      <Path d="M8 12a2 2 0 0 0 2-2V8H8" stroke={color} />
      <Path d="M14 12a2 2 0 0 0 2-2V8h-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareQuote'

export const MessageSquareQuote = memo<IconProps>(themed(Icon))
