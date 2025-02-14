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
      <Path d="M10 10h4" stroke={color} />
      <Path d="M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" stroke={color} />
      <Path
        d="M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z"
        stroke={color}
      />
      <Path d="M 22 16 L 2 16" stroke={color} />
      <Path
        d="M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z"
        stroke={color}
      />
      <Path d="M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Binoculars'

export const Binoculars: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
