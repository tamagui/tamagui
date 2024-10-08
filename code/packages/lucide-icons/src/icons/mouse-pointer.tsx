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
      <Path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" stroke={color} />
      <Path d="m13 13 6 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MousePointer'

export const MousePointer = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
