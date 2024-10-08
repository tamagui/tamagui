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
      <Path d="M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2" stroke={color} />
      <Path d="M2 9h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2" stroke={color} />
      <Path
        d="M22 17v1a1 1 0 0 1-1 1H10v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9"
        stroke={color}
      />
      <_Circle cx="8" cy="19" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Caravan'

export const Caravan = memo<IconProps>(themed(Icon))
