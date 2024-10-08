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
      <Path d="m18 8 4 4-4 4" stroke={color} />
      <Path d="m6 8-4 4 4 4" stroke={color} />
      <Path d="M8 12h.01" stroke={color} />
      <Path d="M12 12h.01" stroke={color} />
      <Path d="M16 12h.01" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ChevronsLeftRightEllipsis'

export const ChevronsLeftRightEllipsis = memo<IconProps>(themed(Icon))
