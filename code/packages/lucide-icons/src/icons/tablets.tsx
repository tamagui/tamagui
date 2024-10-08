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
      <_Circle cx="7" cy="7" r="5" stroke={color} />
      <_Circle cx="17" cy="17" r="5" stroke={color} />
      <Path d="M12 17h10" stroke={color} />
      <Path d="m3.46 10.54 7.08-7.08" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Tablets'

export const Tablets = memo<IconProps>(themed(Icon))
