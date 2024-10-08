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
      <Path d="M9 19h6" stroke={color} />
      <Path d="M9 15v-3H5l7-7 7 7h-4v3H9z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowBigUpDash'

export const ArrowBigUpDash = memo<IconProps>(themed(Icon))
