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
      <Path d="M21 3 9 15" stroke={color} />
      <Path d="M12 3H3v18h18v-9" stroke={color} />
      <Path d="M16 3h5v5" stroke={color} />
      <Path d="M14 15H9v-5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Scaling'

export const Scaling = memo<IconProps>(themed(Icon, { resolveValues: 'auto' }))
