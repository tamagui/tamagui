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
      <Path d="M16 9a5 5 0 0 1 .95 2.293" stroke={color} />
      <Path d="M19.364 5.636a9 9 0 0 1 1.889 9.96" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path
        d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11"
        stroke={color}
      />
      <Path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'VolumeOff'

export const VolumeOff = memo<IconProps>(themed(Icon))
