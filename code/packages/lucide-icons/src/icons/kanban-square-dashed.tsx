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
      <Path d="M8 7v7" stroke={color} />
      <Path d="M12 7v4" stroke={color} />
      <Path d="M16 7v9" stroke={color} />
      <Path d="M5 3a2 2 0 0 0-2 2" stroke={color} />
      <Path d="M9 3h1" stroke={color} />
      <Path d="M14 3h1" stroke={color} />
      <Path d="M19 3a2 2 0 0 1 2 2" stroke={color} />
      <Path d="M21 9v1" stroke={color} />
      <Path d="M21 14v1" stroke={color} />
      <Path d="M21 19a2 2 0 0 1-2 2" stroke={color} />
      <Path d="M14 21h1" stroke={color} />
      <Path d="M9 21h1" stroke={color} />
      <Path d="M5 21a2 2 0 0 1-2-2" stroke={color} />
      <Path d="M3 14v1" stroke={color} />
      <Path d="M3 9v1" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'KanbanSquareDashed'

export const KanbanSquareDashed: NamedExoticComponent<IconProps> = memo<IconProps>(
  themed(Icon)
)
