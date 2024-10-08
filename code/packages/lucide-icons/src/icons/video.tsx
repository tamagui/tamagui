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
      <Path d="m22 8-6 4 6 4V8Z" stroke={color} />
      <Rect width="14" height="12" x="2" y="6" rx="2" ry="2" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Video'

export const Video = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
