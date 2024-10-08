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
      <Path d="M19.7 14a6.9 6.9 0 0 0 .3-2V5l-8-3-3.2 1.2" stroke={color} />
      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M4.7 4.7 4 5v7c0 6 8 10 8 10a20.3 20.3 0 0 0 5.62-4.38" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShieldOff'

export const ShieldOff = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
