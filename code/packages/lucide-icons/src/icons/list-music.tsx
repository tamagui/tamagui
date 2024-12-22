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
      <Path d="M21 15V6" stroke={color} />
      <Path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke={color} />
      <Path d="M12 12H3" stroke={color} />
      <Path d="M16 6H3" stroke={color} />
      <Path d="M12 18H3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ListMusic'

export const ListMusic = memo<IconProps>(themed(Icon))
