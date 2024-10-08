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
      <Path d="M9 2h6l3 7H6l3-7Z" stroke={color} />
      <Path d="M12 9v13" stroke={color} />
      <Path d="M9 22h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LampFloor'

export const LampFloor = memo<IconProps>(themed(Icon))
