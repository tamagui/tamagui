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
      <Path d="M12 6v.343" stroke={color} />
      <Path d="M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218" stroke={color} />
      <Path d="M19 13.343V9A7 7 0 0 0 8.56 2.902" stroke={color} />
      <Path d="M22 22 2 2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MouseOff'

export const MouseOff = memo<IconProps>(themed(Icon))
