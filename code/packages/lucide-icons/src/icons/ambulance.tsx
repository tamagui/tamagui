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
      <Path d="M10 10H6" stroke={color} />
      <Path
        d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"
        stroke={color}
      />
      <Path
        d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"
        stroke={color}
      />
      <Path d="M8 8v4" stroke={color} />
      <Path d="M9 18h6" stroke={color} />
      <_Circle cx="17" cy="18" r="2" stroke={color} />
      <_Circle cx="7" cy="18" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Ambulance'

export const Ambulance = memo<IconProps>(themed(Icon))
