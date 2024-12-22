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
      <_Circle cx="12" cy="12" r="4" stroke={color} />
      <Path d="M12 3v1" stroke={color} />
      <Path d="M12 20v1" stroke={color} />
      <Path d="M3 12h1" stroke={color} />
      <Path d="M20 12h1" stroke={color} />
      <Path d="m18.364 5.636-.707.707" stroke={color} />
      <Path d="m6.343 17.657-.707.707" stroke={color} />
      <Path d="m5.636 5.636.707.707" stroke={color} />
      <Path d="m17.657 17.657.707.707" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SunMedium'

export const SunMedium = memo<IconProps>(themed(Icon))
