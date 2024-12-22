import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path, Rect } from 'react-native-svg'
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
      <Path d="M18 22H4a2 2 0 0 1-2-2V6" stroke={color} />
      <Path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" stroke={color} />
      <_Circle cx="12" cy="8" r="2" stroke={color} />
      <Rect width="16" height="16" x="6" y="2" rx="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Images'

export const Images = memo<IconProps>(themed(Icon))
