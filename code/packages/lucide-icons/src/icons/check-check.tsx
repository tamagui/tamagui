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
      <Path d="M18 6 7 17l-5-5" stroke={color} />
      <Path d="m22 10-7.5 7.5L13 16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CheckCheck'

export const CheckCheck = memo<IconProps>(themed(Icon))
