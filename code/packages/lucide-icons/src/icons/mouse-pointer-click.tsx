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
      <Path d="M14 4.1 12 6" stroke={color} />
      <Path d="m5.1 8-2.9-.8" stroke={color} />
      <Path d="m6 12-1.9 2" stroke={color} />
      <Path d="M7.2 2.2 8 5.1" stroke={color} />
      <Path
        d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'MousePointerClick'

export const MousePointerClick = memo<IconProps>(themed(Icon))
