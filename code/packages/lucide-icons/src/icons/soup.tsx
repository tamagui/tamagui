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
      <Path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" stroke={color} />
      <Path d="M7 21h10" stroke={color} />
      <Path d="M19.5 12 22 6" stroke={color} />
      <Path
        d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62"
        stroke={color}
      />
      <Path
        d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62"
        stroke={color}
      />
      <Path
        d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62"
        stroke={color}
      />
    </Svg>
  )
}

Icon.displayName = 'Soup'

export const Soup = memo<IconProps>(themed(Icon))
