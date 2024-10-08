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
      <Path d="M4.5 3h15" stroke={color} />
      <Path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" stroke={color} />
      <Path d="M6 14h12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Beaker'

export const Beaker = memo<IconProps>(themed(Icon))
