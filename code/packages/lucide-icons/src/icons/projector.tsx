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
      <Path d="M5 7 3 5" stroke={color} />
      <Path d="M9 6V3" stroke={color} />
      <Path d="m13 7 2-2" stroke={color} />
      <_Circle cx="9" cy="13" r="3" stroke={color} />
      <Path
        d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17"
        stroke={color}
      />
      <Path d="M16 16h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Projector'

export const Projector = memo<IconProps>(themed(Icon))
