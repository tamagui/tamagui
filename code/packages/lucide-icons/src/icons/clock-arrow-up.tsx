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
      <Path d="M13.228 21.925A10 10 0 1 1 21.994 12.338" stroke={color} />
      <Path d="M12 6v6l1.562.781" stroke={color} />
      <Path d="m14 18 4-4 4 4" stroke={color} />
      <Path d="M18 22v-8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ClockArrowUp'

export const ClockArrowUp = memo<IconProps>(themed(Icon))
