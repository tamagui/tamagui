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
      <Path d="M6 2v14a2 2 0 0 0 2 2h14" stroke={color} />
      <Path d="M18 22V8a2 2 0 0 0-2-2H2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Crop'

export const Crop = memo<IconProps>(themed(Icon))
