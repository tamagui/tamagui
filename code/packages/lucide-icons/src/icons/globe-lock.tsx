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
      <Path
        d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13"
        stroke={color}
      />
      <Path d="M2 12h8.5" stroke={color} />
      <Path d="M20 6V4a2 2 0 1 0-4 0v2" stroke={color} />
      <Rect width="8" height="5" x="14" y="6" rx="1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GlobeLock'

export const GlobeLock = memo<IconProps>(themed(Icon))
