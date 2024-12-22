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
      <Path d="M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" stroke={color} />
      <Path d="M14 11V9a2 2 0 1 0-4 0v2" stroke={color} />
      <Path d="M10 10.5V5a2 2 0 1 0-4 0v9" stroke={color} />
      <Path
        d="m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'HandMetal'

export const HandMetal = memo<IconProps>(themed(Icon))
