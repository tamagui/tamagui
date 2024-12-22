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
      <Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke={color} />
      <Path d="M8 15h.01" stroke={color} />
      <Path d="M8 19h.01" stroke={color} />
      <Path d="M12 17h.01" stroke={color} />
      <Path d="M12 21h.01" stroke={color} />
      <Path d="M16 15h.01" stroke={color} />
      <Path d="M16 19h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CloudSnow'

export const CloudSnow = memo<IconProps>(themed(Icon))
