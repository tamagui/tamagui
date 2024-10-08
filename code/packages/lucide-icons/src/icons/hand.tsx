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
      <Path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" stroke={color} />
      <Path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" stroke={color} />
      <Path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" stroke={color} />
      <Path
        d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Hand'

export const Hand = memo<IconProps>(themed(Icon))
