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
      <Path d="M10 2h4" stroke={color} />
      <Path d="M12 14v-4" stroke={color} />
      <Path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" stroke={color} />
      <Path d="M9 17H4v5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TimerReset'

export const TimerReset = memo<IconProps>(themed(Icon))
