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
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Path d="M12 2v2" stroke={color} />
      <Path d="M12 20v2" stroke={color} />
      <Path d="m4.93 4.93 1.41 1.41" stroke={color} />
      <Path d="m17.66 17.66 1.41 1.41" stroke={color} />
      <Path d="M2 12h2" stroke={color} />
      <Path d="M20 12h2" stroke={color} />
      <Path d="m6.34 17.66-1.41 1.41" stroke={color} />
      <Path d="m19.07 4.93-1.41 1.41" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sun'

export const Sun = memo<IconProps>(themed(Icon))
