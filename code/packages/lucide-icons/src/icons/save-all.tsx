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
      <Path d="M10 2v3a1 1 0 0 0 1 1h5" stroke={color} />
      <Path d="M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" stroke={color} />
      <Path d="M18 22H4a2 2 0 0 1-2-2V6" stroke={color} />
      <Path
        d="M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'SaveAll'

export const SaveAll = memo<IconProps>(themed(Icon))
