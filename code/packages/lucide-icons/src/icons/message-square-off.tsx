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
      <Path d="M21 15V5a2 2 0 0 0-2-2H9" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M3.6 3.6c-.4.3-.6.8-.6 1.4v16l4-4h10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageSquareOff'

export const MessageSquareOff = memo<IconProps>(themed(Icon))
