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
      <Path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2" stroke={color} />
      <Path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" stroke={color} />
      <Path d="M18 22V5l-6-3-6 3v17" stroke={color} />
      <Path d="M12 7v5" stroke={color} />
      <Path d="M10 9h4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Church'

export const Church = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
