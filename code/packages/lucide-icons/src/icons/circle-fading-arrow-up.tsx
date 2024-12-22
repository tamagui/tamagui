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
      <Path d="M12 2a10 10 0 0 1 7.38 16.75" stroke={color} />
      <Path d="m16 12-4-4-4 4" stroke={color} />
      <Path d="M12 16V8" stroke={color} />
      <Path d="M2.5 8.875a10 10 0 0 0-.5 3" stroke={color} />
      <Path d="M2.83 16a10 10 0 0 0 2.43 3.4" stroke={color} />
      <Path d="M4.636 5.235a10 10 0 0 1 .891-.857" stroke={color} />
      <Path d="M8.644 21.42a10 10 0 0 0 7.631-.38" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CircleFadingArrowUp'

export const CircleFadingArrowUp = memo<IconProps>(themed(Icon))
