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
      <Path d="M12 22v-6" stroke={color} />
      <Path d="M12 8V2" stroke={color} />
      <Path d="M4 12H2" stroke={color} />
      <Path d="M10 12H8" stroke={color} />
      <Path d="M16 12h-2" stroke={color} />
      <Path d="M22 12h-2" stroke={color} />
      <Path d="m15 19-3 3-3-3" stroke={color} />
      <Path d="m15 5-3-3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'UnfoldVertical'

export const UnfoldVertical = memo<IconProps>(themed(Icon))
