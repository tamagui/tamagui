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
        d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
        stroke={color}
      />
      <Path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" stroke={color} />
      <Path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Layers'

export const Layers = memo<IconProps>(themed(Icon))
