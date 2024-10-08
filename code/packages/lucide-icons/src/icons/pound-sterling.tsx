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
      <Path d="M18 7c0-5.333-8-5.333-8 0" stroke={color} />
      <Path d="M10 7v14" stroke={color} />
      <Path d="M6 21h12" stroke={color} />
      <Path d="M6 13h10" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PoundSterling'

export const PoundSterling = memo<IconProps>(themed(Icon))
