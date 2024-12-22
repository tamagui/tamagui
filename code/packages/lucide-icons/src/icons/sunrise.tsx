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
      <Path d="M12 2v8" stroke={color} />
      <Path d="m4.93 10.93 1.41 1.41" stroke={color} />
      <Path d="M2 18h2" stroke={color} />
      <Path d="M20 18h2" stroke={color} />
      <Path d="m19.07 10.93-1.41 1.41" stroke={color} />
      <Path d="M22 22H2" stroke={color} />
      <Path d="m8 6 4-4 4 4" stroke={color} />
      <Path d="M16 18a4 4 0 0 0-8 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sunrise'

export const Sunrise = memo<IconProps>(themed(Icon))
