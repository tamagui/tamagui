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
      <Path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" stroke={color} />
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke={color} />
      <Path d="M7 16.5 8 22l-3-1-3 1 1-5.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileBadge'

export const FileBadge = memo<IconProps>(themed(Icon))
