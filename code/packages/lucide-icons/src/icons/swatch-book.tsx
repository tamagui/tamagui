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
      <Path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" stroke={color} />
      <Path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" stroke={color} />
      <Path d="M 7 17h.01" stroke={color} />
      <Path
        d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'SwatchBook'

export const SwatchBook = memo<IconProps>(themed(Icon))
