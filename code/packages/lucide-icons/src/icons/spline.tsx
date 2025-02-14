import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <_Circle cx="19" cy="5" r="2" stroke={color} />
      <_Circle cx="5" cy="19" r="2" stroke={color} />
      <Path d="M5 17A12 12 0 0 1 17 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Spline'

export const Spline: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
