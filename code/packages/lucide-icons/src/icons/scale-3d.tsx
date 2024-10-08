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
      <_Circle cx="19" cy="19" r="2" stroke={color} />
      <_Circle cx="5" cy="5" r="2" stroke={color} />
      <Path d="M5 7v12h12" stroke={color} />
      <Path d="m5 19 6-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Scale3d'

export const Scale3d = memo<IconProps>(themed(Icon))
