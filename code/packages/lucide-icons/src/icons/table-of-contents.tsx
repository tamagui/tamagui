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
      <Path d="M16 6H3" stroke={color} />
      <Path d="M21 12h.01" stroke={color} />
      <Path d="M21 18h.01" stroke={color} />
      <Path d="M21 6h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TableOfContents'

export const TableOfContents = memo<IconProps>(themed(Icon))
