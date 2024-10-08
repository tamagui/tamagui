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
      <_Circle cx="12" cy="10" r="8" stroke={color} />
      <_Circle cx="12" cy="10" r="3" stroke={color} />
      <Path d="M7 22h10" stroke={color} />
      <Path d="M12 22v-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Webcam'

export const Webcam = memo<IconProps>(themed(Icon))
