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
      <Path d="M12 17V3" stroke={color} />
      <Path d="m6 11 6 6 6-6" stroke={color} />
      <Path d="M19 21H5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowDownToLine'

export const ArrowDownToLine = memo<IconProps>(themed(Icon))
