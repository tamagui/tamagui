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
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path d="M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2" stroke={color} />
      <Path d="M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6" stroke={color} />
      <Path d="m5 11-3 3" stroke={color} />
      <Path d="m5 17-3-3h10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FileOutput'

export const FileOutput = memo<IconProps>(themed(Icon))
