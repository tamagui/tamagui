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
        d="M19.3 14.8C20.1 16.4 21 17 21 17H3s3-2 3-9c0-3.3 2.7-6 6-6 1 0 1.9.2 2.8.7"
        stroke={color}
      />
      <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke={color} />
      <Path d="M15 8h6" stroke={color} />
      <Path d="M18 5v6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BellPlus'

export const BellPlus = memo<IconProps>(themed(Icon))
