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
      <Path d="m8 6 4-4 4 4" stroke={color} />
      <Path d="M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" stroke={color} />
      <Path d="m20 22-5-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Merge'

export const Merge = memo<IconProps>(themed(Icon))
