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
      <Path d="m16 6 4 14" stroke={color} />
      <Path d="M12 6v14" stroke={color} />
      <Path d="M8 8v12" stroke={color} />
      <Path d="M4 4v16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Library'

export const Library = memo<IconProps>(themed(Icon))
