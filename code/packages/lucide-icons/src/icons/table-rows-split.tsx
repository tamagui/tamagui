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
      <Path d="M14 10h2" stroke={color} />
      <Path d="M15 22v-8" stroke={color} />
      <Path d="M15 2v4" stroke={color} />
      <Path d="M2 10h2" stroke={color} />
      <Path d="M20 10h2" stroke={color} />
      <Path d="M3 19h18" stroke={color} />
      <Path d="M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6" stroke={color} />
      <Path d="M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2" stroke={color} />
      <Path d="M8 10h2" stroke={color} />
      <Path d="M9 22v-8" stroke={color} />
      <Path d="M9 2v4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TableRowsSplit'

export const TableRowsSplit = memo<IconProps>(themed(Icon))
