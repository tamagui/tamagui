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
      <Path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" stroke={color} />
      <Path d="M3 5v14a2 2 0 0 0 2 2h16v-5" stroke={color} />
      <Path d="M18 12a2 2 0 0 0 0 4h4v-4Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Wallet'

export const Wallet = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
