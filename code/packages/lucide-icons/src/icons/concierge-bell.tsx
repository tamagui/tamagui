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
        d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z"
        stroke={color}
      />
      <Path d="M20 16a8 8 0 1 0-16 0" stroke={color} />
      <Path d="M12 4v4" stroke={color} />
      <Path d="M10 4h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ConciergeBell'

export const ConciergeBell = memo<IconProps>(themed(Icon))
