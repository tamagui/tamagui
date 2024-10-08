import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <Path
        d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"
        stroke={color}
      />
      <Path d="m13.56 11.747 4.332-.924" stroke={color} />
      <Path d="m16 21-3.105-6.21" stroke={color} />
      <Path
        d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"
        stroke={color}
      />
      <Path d="m6.158 8.633 1.114 4.456" stroke={color} />
      <Path d="m8 21 3.105-6.21" stroke={color} />
      <_Circle cx="12" cy="13" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Telescope'

export const Telescope = memo<IconProps>(themed(Icon))
