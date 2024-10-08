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
      <Path
        d="M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077"
        stroke={color}
      />
      <_Circle cx="12" cy="10" r="3" stroke={color} />
      <Path d="m21.5 15.5-5 5" stroke={color} />
      <Path d="m21.5 20.5-5-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MapPinX'

export const MapPinX = memo<IconProps>(themed(Icon))
