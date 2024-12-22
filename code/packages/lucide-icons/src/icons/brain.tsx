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
      <Path
        d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
        stroke={color}
      />
      <Path
        d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
        stroke={color}
      />
      <Path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" stroke={color} />
      <Path d="M17.599 6.5a3 3 0 0 0 .399-1.375" stroke={color} />
      <Path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" stroke={color} />
      <Path d="M3.477 10.896a4 4 0 0 1 .585-.396" stroke={color} />
      <Path d="M19.938 10.5a4 4 0 0 1 .585.396" stroke={color} />
      <Path d="M6 18a4 4 0 0 1-1.967-.516" stroke={color} />
      <Path d="M19.967 17.484A4 4 0 0 1 18 18" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'Brain'

export const Brain = memo<IconProps>(themed(Icon))
