import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M16 12H3" stroke={color} />
      <Path d="M16 18H3" stroke={color} />
      <Path d="M10 6H3" stroke={color} />
      <Path d="M21 18V8a2 2 0 0 0-2-2h-5" stroke={color} />
      <Path d="m16 8-2-2 2-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListStart'

export const ListStart = memo<IconProps>(themed(Icon))
