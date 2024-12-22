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
      <Path d="M12 2v4" stroke={color} />
      <Path d="m16.2 7.8 2.9-2.9" stroke={color} />
      <Path d="M18 12h4" stroke={color} />
      <Path d="m16.2 16.2 2.9 2.9" stroke={color} />
      <Path d="M12 18v4" stroke={color} />
      <Path d="m4.9 19.1 2.9-2.9" stroke={color} />
      <Path d="M2 12h4" stroke={color} />
      <Path d="m4.9 4.9 2.9 2.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Loader'

export const Loader = memo<IconProps>(themed(Icon))
