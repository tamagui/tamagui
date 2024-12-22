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
        d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"
        stroke={color}
      />
      <Path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9" stroke={color} />
      <Path d="M21 21v-2h-4" stroke={color} />
      <Path d="M3 5h4V3" stroke={color} />
      <Path
        d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Cable'

export const Cable = memo<IconProps>(themed(Icon))
