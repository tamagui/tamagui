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
      <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} />
      <Path d="M10 4v4" stroke={color} />
      <Path d="M2 8h20" stroke={color} />
      <Path d="M6 4v4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AppWindow'

export const AppWindow = memo<IconProps>(themed(Icon))
