import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
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
      <Path d="M7 21h10" stroke={color} />
      <Rect width="20" height="14" x="2" y="3" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'TvMinimal'

export const TvMinimal = memo<IconProps>(themed(Icon))
