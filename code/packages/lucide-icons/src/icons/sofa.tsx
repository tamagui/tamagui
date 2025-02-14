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
      <Path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" stroke={color} />
      <Path
        d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"
        stroke={color}
      />
      <Path d="M4 18v2" stroke={color} />
      <Path d="M20 18v2" stroke={color} />
      <Path d="M12 4v9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Sofa'

export const Sofa: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
