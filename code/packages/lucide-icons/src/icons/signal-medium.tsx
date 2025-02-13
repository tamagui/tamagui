import { memo } from 'react'
import type { NamedExoticComponent } from 'react'
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
      <Path d="M2 20h.01" stroke={color} />
      <Path d="M7 20v-4" stroke={color} />
      <Path d="M12 20v-8" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'SignalMedium'

export const SignalMedium: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
