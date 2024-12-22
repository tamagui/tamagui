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
      <Path d="M12 2v1" stroke={color} />
      <Path
        d="M15.5 21a1.85 1.85 0 0 1-3.5-1v-8H2a10 10 0 0 1 3.428-6.575"
        stroke={color}
      />
      <Path d="M17.5 12H22A10 10 0 0 0 9.004 3.455" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UmbrellaOff'

export const UmbrellaOff = memo<IconProps>(themed(Icon))
