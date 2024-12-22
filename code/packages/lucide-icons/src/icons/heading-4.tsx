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
      <Path d="M4 12h8" stroke={color} />
      <Path d="M4 18V6" stroke={color} />
      <Path d="M12 18V6" stroke={color} />
      <Path d="M17 10v4h4" stroke={color} />
      <Path d="M21 10v8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Heading4'

export const Heading4 = memo<IconProps>(themed(Icon))
