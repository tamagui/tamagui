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
      <Path d="M10 2v2" stroke={color} />
      <Path d="M14 2v4" stroke={color} />
      <Path d="M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" stroke={color} />
      <Path
        d="M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'PaintbrushVertical'

export const PaintbrushVertical = memo<IconProps>(themed(Icon))
