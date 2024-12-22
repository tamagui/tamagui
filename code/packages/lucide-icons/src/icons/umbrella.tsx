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
      <Path d="M22 12a10.06 10.06 1 0 0-20 0Z" stroke={color} />
      <Path d="M12 12v8a2 2 0 0 0 4 0" stroke={color} />
      <Path d="M12 2v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Umbrella'

export const Umbrella = memo<IconProps>(themed(Icon))
