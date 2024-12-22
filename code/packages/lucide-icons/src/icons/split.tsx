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
      <Path d="M16 3h5v5" stroke={color} />
      <Path d="M8 3H3v5" stroke={color} />
      <Path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" stroke={color} />
      <Path d="m15 9 6-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Split'

export const Split = memo<IconProps>(themed(Icon))
