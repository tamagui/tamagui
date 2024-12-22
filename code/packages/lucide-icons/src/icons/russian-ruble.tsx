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
      <Path d="M6 11h8a4 4 0 0 0 0-8H9v18" stroke={color} />
      <Path d="M6 15h8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'RussianRuble'

export const RussianRuble = memo<IconProps>(themed(Icon))
