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
      <Path d="m19 5 3-3" stroke={color} />
      <Path d="m2 22 3-3" stroke={color} />
      <Path
        d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z"
        stroke={color}
      />
      <Path d="M7.5 13.5 10 11" stroke={color} />
      <Path d="M10.5 16.5 13 14" stroke={color} />
      <Path
        d="m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Unplug'

export const Unplug = memo<IconProps>(themed(Icon))
