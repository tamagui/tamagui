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
      <Path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" stroke={color} />
      <Path d="m14.5 7.5-5 5" stroke={color} />
      <Path d="m9.5 7.5 5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BookmarkX'

export const BookmarkX = memo<IconProps>(themed(Icon))
