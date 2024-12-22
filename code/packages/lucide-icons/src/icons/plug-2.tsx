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
      <Path d="M9 2v6" stroke={color} />
      <Path d="M15 2v6" stroke={color} />
      <Path d="M12 17v5" stroke={color} />
      <Path d="M5 8h14" stroke={color} />
      <Path d="M6 11V8h12v3a6 6 0 1 1-12 0Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Plug2'

export const Plug2 = memo<IconProps>(themed(Icon))
