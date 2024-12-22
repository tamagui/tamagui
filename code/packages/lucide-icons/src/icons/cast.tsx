import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
        d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
        stroke={color}
      />
      <Path d="M2 12a9 9 0 0 1 8 8" stroke={color} />
      <Path d="M2 16a5 5 0 0 1 4 4" stroke={color} />
      <Line x1="2" x2="2.01" y1="20" y2="20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cast'

export const Cast = memo<IconProps>(themed(Icon))
