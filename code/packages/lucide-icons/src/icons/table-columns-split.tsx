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
      <Path d="M14 14v2" stroke={color} />
      <Path d="M14 20v2" stroke={color} />
      <Path d="M14 2v2" stroke={color} />
      <Path d="M14 8v2" stroke={color} />
      <Path d="M2 15h8" stroke={color} />
      <Path d="M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2" stroke={color} />
      <Path d="M2 9h8" stroke={color} />
      <Path d="M22 15h-4" stroke={color} />
      <Path d="M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" stroke={color} />
      <Path d="M22 9h-4" stroke={color} />
      <Path d="M5 3v18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TableColumnsSplit'

export const TableColumnsSplit = memo<IconProps>(themed(Icon))
