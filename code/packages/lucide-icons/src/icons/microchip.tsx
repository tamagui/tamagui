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
      <Path d="M18 12h2" stroke={color} />
      <Path d="M18 16h2" stroke={color} />
      <Path d="M18 20h2" stroke={color} />
      <Path d="M18 4h2" stroke={color} />
      <Path d="M18 8h2" stroke={color} />
      <Path d="M4 12h2" stroke={color} />
      <Path d="M4 16h2" stroke={color} />
      <Path d="M4 20h2" stroke={color} />
      <Path d="M4 4h2" stroke={color} />
      <Path d="M4 8h2" stroke={color} />
      <Path
        d="M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1.5c-.276 0-.494.227-.562.495a2 2 0 0 1-3.876 0C9.994 2.227 9.776 2 9.5 2z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Microchip'

export const Microchip = memo<IconProps>(themed(Icon))
