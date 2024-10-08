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
        d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8"
        stroke={color}
      />
      <Path d="M10 5H8a2 2 0 0 0 0 4h.68" stroke={color} />
      <Path
        d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8"
        stroke={color}
      />
      <Path d="M14 5h2a2 2 0 0 1 0 4h-.68" stroke={color} />
      <Path d="M18 22H6" stroke={color} />
      <Path d="M9 2h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Amphora'

export const Amphora = memo<IconProps>(themed(Icon))
