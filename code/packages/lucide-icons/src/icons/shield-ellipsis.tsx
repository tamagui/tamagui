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
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" stroke={color} />
      <Path d="M8 11h.01" stroke={color} />
      <Path d="M12 11h.01" stroke={color} />
      <Path d="M16 11h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ShieldEllipsis'

export const ShieldEllipsis = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
