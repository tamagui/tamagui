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
      <Path d="m3 11 18-5v12L3 14v-3z" stroke={color} />
      <Path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Megaphone'

export const Megaphone = memo<IconProps>(themed(Icon))
