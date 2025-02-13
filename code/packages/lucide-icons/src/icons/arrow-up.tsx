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
      <Path d="m5 12 7-7 7 7" stroke={color} />
      <Path d="M12 19V5" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'ArrowUp'

export const ArrowUp: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
