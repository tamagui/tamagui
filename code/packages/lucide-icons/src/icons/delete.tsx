import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
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
      <Path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" stroke={color} />
      <Line x1="18" x2="12" y1="9" y2="15" stroke={color} />
      <Line x1="12" x2="18" y1="9" y2="15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Delete'

export const Delete = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
