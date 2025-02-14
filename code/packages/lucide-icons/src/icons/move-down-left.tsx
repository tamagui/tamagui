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
      <Path d="M11 19H5V13" stroke={color} />
      <Path d="M19 5L5 19" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'MoveDownLeft'

export const MoveDownLeft: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
