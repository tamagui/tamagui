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
      <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'AtSign'

export const AtSign = memo<IconProps>(themed(Icon))
