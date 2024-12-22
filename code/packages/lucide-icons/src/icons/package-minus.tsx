import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path, Polyline } from 'react-native-svg'
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
      <Path d="M16 16h6" stroke={color} />
      <Path
        d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
        stroke={color}
      />
      <Path d="m7.5 4.27 9 5.15" stroke={color} />
      <Polyline points="3.29 7 12 12 20.71 7" stroke={color} />
      <Line x1="12" x2="12" y1="22" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PackageMinus'

export const PackageMinus = memo<IconProps>(themed(Icon))
