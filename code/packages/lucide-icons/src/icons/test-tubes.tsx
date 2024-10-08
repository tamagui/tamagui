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
      <Path d="M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2" stroke={color} />
      <Path d="M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2" stroke={color} />
      <Path d="M3 2h7" stroke={color} />
      <Path d="M14 2h7" stroke={color} />
      <Path d="M9 16H4" stroke={color} />
      <Path d="M20 16h-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TestTubes'

export const TestTubes = memo<IconProps>(themed(Icon))
