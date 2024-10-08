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
      <Path d="M16.85 18.58a9 9 0 1 0-9.7 0" stroke={color} />
      <Path d="M8 14a5 5 0 1 1 8 0" stroke={color} />
      <_Circle cx="12" cy="11" r="1" stroke={color} />
      <Path d="M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Podcast'

export const Podcast = memo<IconProps>(themed(Icon))
