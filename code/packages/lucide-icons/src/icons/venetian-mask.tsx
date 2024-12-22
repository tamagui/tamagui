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
      <Path
        d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"
        stroke={color}
      />
      <Path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z" stroke={color} />
      <Path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'VenetianMask'

export const VenetianMask = memo<IconProps>(themed(Icon))
