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
      <Path d="M2 12h20" stroke={color} />
      <Path d="M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" stroke={color} />
      <Path d="M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" stroke={color} />
      <Path d="M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1" stroke={color} />
      <Path d="M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AlignCenterHorizontal'

export const AlignCenterHorizontal = memo<IconProps>(themed(Icon))
