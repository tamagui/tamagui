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
      <_Circle cx="12" cy="12" r="10" stroke={color} />
      <Path d="M12 12V6" stroke={color} />
      <Path d="M8 7.5A6.1 6.1 0 0 0 12 18a6 6 0 0 0 4-10.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PowerCircle'

export const PowerCircle = memo<IconProps>(themed(Icon))
