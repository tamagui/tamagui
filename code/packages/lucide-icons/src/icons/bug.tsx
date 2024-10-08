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
      <Path d="m8 2 1.88 1.88" stroke={color} />
      <Path d="M14.12 3.88 16 2" stroke={color} />
      <Path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" stroke={color} />
      <Path
        d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"
        stroke={color}
      />
      <Path d="M12 20v-9" stroke={color} />
      <Path d="M6.53 9C4.6 8.8 3 7.1 3 5" stroke={color} />
      <Path d="M6 13H2" stroke={color} />
      <Path d="M3 21c0-2.1 1.7-3.9 3.8-4" stroke={color} />
      <Path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" stroke={color} />
      <Path d="M22 13h-4" stroke={color} />
      <Path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bug'

export const Bug = memo<IconProps>(themed(Icon))
