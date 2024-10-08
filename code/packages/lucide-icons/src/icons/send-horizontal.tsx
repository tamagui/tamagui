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
      <Path d="m3 3 3 9-3 9 19-9Z" stroke={color} />
      <Path d="M6 12h16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SendHorizontal'

export const SendHorizontal = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
