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
      <Path d="M16 10h2" stroke={color} />
      <Path d="M16 14h2" stroke={color} />
      <Path d="M6.17 15a3 3 0 0 1 5.66 0" stroke={color} />
      <_Circle cx="9" cy="11" r="2" stroke={color} />
      <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'IdCard'

export const IdCard = memo<IconProps>(themed(Icon))
