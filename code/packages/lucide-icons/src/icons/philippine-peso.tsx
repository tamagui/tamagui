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
      <Path d="M20 11H4" stroke={color} />
      <Path d="M20 7H4" stroke={color} />
      <Path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'PhilippinePeso'

export const PhilippinePeso = memo<IconProps>(themed(Icon))
