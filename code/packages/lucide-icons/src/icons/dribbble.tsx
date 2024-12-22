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
      <Path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" stroke={color} />
      <Path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" stroke={color} />
      <Path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Dribbble'

export const Dribbble = memo<IconProps>(themed(Icon))
