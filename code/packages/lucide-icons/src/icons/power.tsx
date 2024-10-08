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
      <Path d="M12 2v10" stroke={color} />
      <Path d="M18.4 6.6a9 9 0 1 1-12.77.04" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Power'

export const Power = memo<IconProps>(themed(Icon))
