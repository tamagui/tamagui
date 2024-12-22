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
      <Path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke={color} />
      <Path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke={color} />
      <Path d="M12 2v2" stroke={color} />
      <Path d="M12 22v-2" stroke={color} />
      <Path d="m17 20.66-1-1.73" stroke={color} />
      <Path d="M11 10.27 7 3.34" stroke={color} />
      <Path d="m20.66 17-1.73-1" stroke={color} />
      <Path d="m3.34 7 1.73 1" stroke={color} />
      <Path d="M14 12h8" stroke={color} />
      <Path d="M2 12h2" stroke={color} />
      <Path d="m20.66 7-1.73 1" stroke={color} />
      <Path d="m3.34 17 1.73-1" stroke={color} />
      <Path d="m17 3.34-1 1.73" stroke={color} />
      <Path d="m11 13.73-4 6.93" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cog'

export const Cog = memo<IconProps>(themed(Icon))
