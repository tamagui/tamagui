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
      <Path d="M17 6.1H3" stroke={color} />
      <Path d="M21 12.1H3" stroke={color} />
      <Path d="M15.1 18H3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Text'

export const Text = memo<IconProps>(themed(Icon))
