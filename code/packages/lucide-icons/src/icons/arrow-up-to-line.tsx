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
      <Path d="M5 3h14" stroke={color} />
      <Path d="m18 13-6-6-6 6" stroke={color} />
      <Path d="M12 7v14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpToLine'

export const ArrowUpToLine = memo<IconProps>(themed(Icon))
