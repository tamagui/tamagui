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
      <Path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        stroke={color}
      />
      <Polyline points="7.5 4.21 12 6.81 16.5 4.21" stroke={color} />
      <Polyline points="7.5 19.79 7.5 14.6 3 12" stroke={color} />
      <Polyline points="21 12 16.5 14.6 16.5 19.79" stroke={color} />
      <Polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke={color} />
      <Line x1="12" x2="12" y1="22.08" y2="12" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Codesandbox'

export const Codesandbox = memo<IconProps>(themed(Icon))
