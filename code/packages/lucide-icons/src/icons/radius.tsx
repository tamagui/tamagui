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
      <Path d="M20.34 17.52a10 10 0 1 0-2.82 2.82" stroke={color} />
      <_Circle cx="19" cy="19" r="2" stroke={color} />
      <Path d="m13.41 13.41 4.18 4.18" stroke={color} />
      <_Circle cx="12" cy="12" r="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Radius'

export const Radius = memo<IconProps>(themed(Icon))
