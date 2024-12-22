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
      <Path d="m9 7-5 5 5 5" stroke={color} />
      <Path d="m15 7 5 5-5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChevronsLeftRight'

export const ChevronsLeftRight = memo<IconProps>(themed(Icon))
