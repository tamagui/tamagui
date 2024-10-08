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
      <Path d="M2 16V4a2 2 0 0 1 2-2h11" stroke={color} />
      <Path
        d="M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12"
        stroke={color}
      />
      <Path d="M5 14H4a2 2 0 1 0 0 4h1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BookCopy'

export const BookCopy = memo<IconProps>(themed(Icon))
