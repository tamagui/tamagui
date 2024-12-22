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
      <Path d="m9 6-6 6 6 6" stroke={color} />
      <Path d="M3 12h14" stroke={color} />
      <Path d="M21 19V5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowLeftFromLine'

export const ArrowLeftFromLine = memo<IconProps>(themed(Icon))
