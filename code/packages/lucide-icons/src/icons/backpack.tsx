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
        d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
        stroke={color}
      />
      <Path d="M8 10h8" stroke={color} />
      <Path d="M8 18h8" stroke={color} />
      <Path d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" stroke={color} />
      <Path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Backpack'

export const Backpack = memo<IconProps>(themed(Icon))
