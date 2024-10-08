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
      <_Circle cx="7" cy="12" r="3" stroke={color} />
      <Path d="M10 9v6" stroke={color} />
      <_Circle cx="17" cy="12" r="3" stroke={color} />
      <Path d="M14 7v8" stroke={color} />
      <Path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'WholeWord'

export const WholeWord = memo<IconProps>(themed(Icon))
