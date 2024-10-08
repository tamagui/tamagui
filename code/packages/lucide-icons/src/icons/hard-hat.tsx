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
        d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"
        stroke={color}
      />
      <Path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" stroke={color} />
      <Path d="M4 15v-3a6 6 0 0 1 6-6" stroke={color} />
      <Path d="M14 6a6 6 0 0 1 6 6v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'HardHat'

export const HardHat = memo<IconProps>(themed(Icon))
