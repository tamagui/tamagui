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
      <Path d="M4 9a2 2 0 0 1-2-2V5h6v2a2 2 0 0 1-2 2Z" stroke={color} />
      <Path d="M3 5V3" stroke={color} />
      <Path d="M7 5V3" stroke={color} />
      <Path d="M19 15V6.5a3.5 3.5 0 0 0-7 0v11a3.5 3.5 0 0 1-7 0V9" stroke={color} />
      <Path d="M17 21v-2" stroke={color} />
      <Path d="M21 21v-2" stroke={color} />
      <Path d="M22 19h-6v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Cable'

export const Cable = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
