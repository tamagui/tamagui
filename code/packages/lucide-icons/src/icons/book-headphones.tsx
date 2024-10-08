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
        d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
        stroke={color}
      />
      <Path d="M8 12v-2a4 4 0 0 1 8 0v2" stroke={color} />
      <_Circle cx="15" cy="12" r="1" stroke={color} />
      <_Circle cx="9" cy="12" r="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BookHeadphones'

export const BookHeadphones = memo<IconProps>(themed(Icon))
