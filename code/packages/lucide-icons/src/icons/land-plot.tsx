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
      <Path d="m12 8 6-3-6-3v10" stroke={color} />
      <Path
        d="m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"
        stroke={color}
      />
      <Path d="m6.49 12.85 11.02 6.3" stroke={color} />
      <Path d="M17.51 12.85 6.5 19.15" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'LandPlot'

export const LandPlot = memo<IconProps>(themed(Icon))
