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
      <Path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" stroke={color} />
      <Path d="M20 3v4" stroke={color} />
      <Path d="M22 5h-4" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MoonStar'

export const MoonStar = memo<IconProps>(themed(Icon))
