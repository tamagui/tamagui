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
      <Path d="M8 22h8" stroke={color} />
      <Path d="M12 11v11" stroke={color} />
      <Path d="m19 3-7 8-7-8Z" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Martini'

export const Martini = memo<IconProps>(themed(Icon))
