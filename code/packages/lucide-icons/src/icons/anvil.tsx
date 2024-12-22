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
      <Path d="M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4" stroke={color} />
      <Path
        d="M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z"
        stroke={color}
      />
      <Path d="M9 12v5" stroke={color} />
      <Path d="M15 12v5" stroke={color} />
      <Path
        d="M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Anvil'

export const Anvil = memo<IconProps>(themed(Icon))
