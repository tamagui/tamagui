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
      <Path d="M13 16a3 3 0 0 1 2.24 5" stroke={color} />
      <Path d="M18 12h.01" stroke={color} />
      <Path
        d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"
        stroke={color}
      />
      <Path d="M20 8.54V4a2 2 0 1 0-4 0v3" stroke={color} />
      <Path d="M7.612 12.524a3 3 0 1 0-1.6 4.3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Rabbit'

export const Rabbit = memo<IconProps>(themed(Icon))
