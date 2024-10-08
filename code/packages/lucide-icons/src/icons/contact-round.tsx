import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path, Rect } from 'react-native-svg'
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
      <Path d="M16 2v2" stroke={color} />
      <Path d="M17.915 22a6 6 0 0 0-12 0" stroke={color} />
      <Path d="M8 2v2" stroke={color} />
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ContactRound'

export const ContactRound = memo<IconProps>(themed(Icon))
