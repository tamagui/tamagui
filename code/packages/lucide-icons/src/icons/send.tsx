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
      <Path d="m22 2-7 20-4-9-9-4Z" stroke={color} />
      <Path d="M22 2 11 13" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Send'

export const Send = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
