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
      <Path d="M12 6v6l4 2" stroke={color} />
      <Path d="M16 21.16a10 10 0 1 1 5-13.516" stroke={color} />
      <Path d="M20 11.5v6" stroke={color} />
      <Path d="M20 21.5h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ClockAlert'

export const ClockAlert = memo<IconProps>(themed(Icon))
