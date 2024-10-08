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
      <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" stroke={color} />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} />
      <Path d="M12 17h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MessageCircleQuestion'

export const MessageCircleQuestion = memo<IconProps>(themed(Icon))
