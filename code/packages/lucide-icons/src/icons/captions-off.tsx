import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
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
      <Path d="M10.5 5H19a2 2 0 0 1 2 2v8.5" stroke={color} />
      <Path d="M17 11h-.5" stroke={color} />
      <Path d="M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M7 11h4" stroke={color} />
      <Path d="M7 15h2.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CaptionsOff'

export const CaptionsOff = memo<IconProps>(themed(Icon))
