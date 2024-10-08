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
      <Path d="M12 22a10 10 0 1 1 10-10" stroke={color} />
      <Path d="M22 22 12 12" stroke={color} />
      <Path d="M22 16v6h-6" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleArrowOutDownRight'

export const CircleArrowOutDownRight = memo<IconProps>(themed(Icon))
