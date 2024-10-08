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
      <Path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" stroke={color} />
      <Path d="M15 13 9 7l4-4 6 6h3a8 8 0 0 1-7 7z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Axe'

export const Axe = memo<IconProps>(themed(Icon))
