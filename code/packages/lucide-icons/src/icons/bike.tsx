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
      <_Circle cx="18.5" cy="17.5" r="3.5" stroke={color} />
      <_Circle cx="5.5" cy="17.5" r="3.5" stroke={color} />
      <_Circle cx="15" cy="5" r="1" stroke={color} />
      <Path d="M12 17.5V14l-3-3 4-3 2 3h2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Bike'

export const Bike = memo<IconProps>(themed(Icon))
