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
      <Path d="M2 6h4" stroke={color} />
      <Path d="M2 10h4" stroke={color} />
      <Path d="M2 14h4" stroke={color} />
      <Path d="M2 18h4" stroke={color} />
      <Rect width="16" height="20" x="4" y="2" rx="2" stroke={color} />
      <Path d="M9.5 8h5" stroke={color} />
      <Path d="M9.5 12H16" stroke={color} />
      <Path d="M9.5 16H14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'NotebookText'

export const NotebookText = memo<IconProps>(themed(Icon))
