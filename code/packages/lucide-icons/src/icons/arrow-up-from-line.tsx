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
      <Path d="m18 9-6-6-6 6" stroke={color} />
      <Path d="M12 3v14" stroke={color} />
      <Path d="M5 21h14" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUpFromLine'

export const ArrowUpFromLine = memo<IconProps>(themed(Icon))
