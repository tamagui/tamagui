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
      <Path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" stroke={color} />
      <Path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" stroke={color} />
      <_Circle cx="12" cy="12" r="3" stroke={color} />
      <Path d="m18 22-3-3 3-3" stroke={color} />
      <Path d="m6 2 3 3-3 3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SwitchCamera'

export const SwitchCamera = memo<IconProps>(themed(Icon))
