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
      <Path
        d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"
        stroke={color}
      />
      <Path d="m14.5 12.5 2-2" stroke={color} />
      <Path d="m11.5 9.5 2-2" stroke={color} />
      <Path d="m8.5 6.5 2-2" stroke={color} />
      <Path d="m17.5 15.5 2-2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Ruler'

export const Ruler = memo<IconProps>(themed(Icon))
