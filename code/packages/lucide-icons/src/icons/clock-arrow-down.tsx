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
      <Path d="M12.338 21.994A10 10 0 1 1 21.925 13.227" stroke={color} />
      <Path d="M12 6v6l2 1" stroke={color} />
      <Path d="m14 18 4 4 4-4" stroke={color} />
      <Path d="M18 14v8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ClockArrowDown'

export const ClockArrowDown = memo<IconProps>(themed(Icon))
