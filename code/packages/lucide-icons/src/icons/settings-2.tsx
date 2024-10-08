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
      <Path d="M20 7h-9" stroke={color} />
      <Path d="M14 17H5" stroke={color} />
      <_Circle cx="17" cy="17" r="3" stroke={color} />
      <_Circle cx="7" cy="7" r="3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Settings2'

export const Settings2 = memo<IconProps>(themed(Icon))
