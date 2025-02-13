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
      <Path d="M2 3h20" stroke={color} />
      <Path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" stroke={color} />
      <Path d="m7 21 5-5 5 5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Presentation'

export const Presentation: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
