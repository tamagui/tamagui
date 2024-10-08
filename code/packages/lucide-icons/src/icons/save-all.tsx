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
        d="M6 4a2 2 0 0 1 2-2h10l4 4v10.2a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-2Z"
        stroke={color}
      />
      <Path d="M10 2v4h6" stroke={color} />
      <Path d="M18 18v-7h-8v7" stroke={color} />
      <Path d="M18 22H4a2 2 0 0 1-2-2V6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SaveAll'

export const SaveAll = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
