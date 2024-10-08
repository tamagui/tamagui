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
        d="M18.4 12c.8 3.8 2.6 5 2.6 5H3s3-2 3-9c0-3.3 2.7-6 6-6 1.8 0 3.4.8 4.5 2"
        stroke={color}
      />
      <Path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke={color} />
      <Path d="M15 8h6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BellMinus'

export const BellMinus = memo<IconProps>(themed(Icon))
