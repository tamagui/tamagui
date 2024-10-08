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
      <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke={color} />
      <Path d="M6 12v5c3 3 9 3 12 0v-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'GraduationCap'

export const GraduationCap = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
