import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Polyline } from 'react-native-svg'
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
      <Polyline points="7 17 2 12 7 7" stroke={color} />
      <Polyline points="12 17 7 12 12 7" stroke={color} />
      <Path d="M22 18v-2a4 4 0 0 0-4-4H7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ReplyAll'

export const ReplyAll = memo<IconProps>(themed(Icon))
