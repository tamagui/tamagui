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
      <Path d="M12 6v12" stroke={color} />
      <Path d="M17.196 9 6.804 15" stroke={color} />
      <Path d="m6.804 9 10.392 6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Asterisk'

export const Asterisk = memo<IconProps>(themed(Icon))
