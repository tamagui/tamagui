import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
      <_Circle cx="12" cy="5" r="1" stroke={color} />
      <Path d="m9 20 3-6 3 6" stroke={color} />
      <Path d="m6 8 6 2 6-2" stroke={color} />
      <Path d="M12 10v4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PersonStanding'

export const PersonStanding = memo<IconProps>(themed(Icon))
