import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
        d="M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5"
        stroke={color}
      />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke={color} />
      <Path d="M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke={color} />
      <_Circle cx="18" cy="18" r="3" stroke={color} />
      <Path d="m22 22-1.5-1.5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MailSearch'

export const MailSearch = memo<IconProps>(themed(Icon))
