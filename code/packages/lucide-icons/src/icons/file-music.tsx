import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <_Circle cx="14" cy="16" r="2" stroke={color} />
      <_Circle cx="6" cy="18" r="2" stroke={color} />
      <Path d="M4 12.4V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-7.5" stroke={color} />
      <Path d="M8 18v-7.7L16 9v7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileMusic'

export const FileMusic = memo<IconProps>(themed(Icon))
