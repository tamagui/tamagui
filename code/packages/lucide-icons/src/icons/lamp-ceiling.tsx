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
      <Path d="M12 2v5" stroke={color} />
      <Path d="M6 7h12l4 9H2l4-9Z" stroke={color} />
      <Path d="M9.17 16a3 3 0 1 0 5.66 0" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LampCeiling'

export const LampCeiling = memo<IconProps>(themed(Icon))
