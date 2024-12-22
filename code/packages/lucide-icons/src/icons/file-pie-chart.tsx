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
      <Path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" stroke={color} />
      <Path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={color} />
      <Path d="M4 11.5a6.02 6.02 0 1 0 8.5 8.5" stroke={color} />
      <Path d="M14 16c0-3.3-2.7-6-6-6v6Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'FilePieChart'

export const FilePieChart = memo<IconProps>(themed(Icon))
