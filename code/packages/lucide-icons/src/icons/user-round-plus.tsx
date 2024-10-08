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
      <Path d="M2 21a8 8 0 0 1 13.292-6" stroke={color} />
      <_Circle cx="10" cy="8" r="5" stroke={color} />
      <Path d="M19 16v6" stroke={color} />
      <Path d="M22 19h-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UserRoundPlus'

export const UserRoundPlus = memo<IconProps>(themed(Icon))
