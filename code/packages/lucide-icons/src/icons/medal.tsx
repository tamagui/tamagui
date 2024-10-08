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
        d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"
        stroke={color}
      />
      <Path d="M11 12 5.12 2.2" stroke={color} />
      <Path d="m13 12 5.88-9.8" stroke={color} />
      <Path d="M8 7h8" stroke={color} />
      <_Circle cx="12" cy="17" r="5" stroke={color} />
      <Path d="M12 18v-2h-.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Medal'

export const Medal = memo<IconProps>(themed(Icon))
