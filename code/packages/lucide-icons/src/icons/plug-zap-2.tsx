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
      <Path d="m13 2-2 2.5h3L12 7" stroke={color} />
      <Path d="M10 14v-3" stroke={color} />
      <Path d="M14 14v-3" stroke={color} />
      <Path d="M11 19c-1.7 0-3-1.3-3-3v-2h8v2c0 1.7-1.3 3-3 3Z" stroke={color} />
      <Path d="M12 22v-3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PlugZap2'

export const PlugZap2 = memo<IconProps>(themed(Icon))
