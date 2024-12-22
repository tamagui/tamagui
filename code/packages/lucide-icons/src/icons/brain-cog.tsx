import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
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
        d="M12 5a3 3 0 1 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588 4 4 0 0 0 7.636 2.106 3.2 3.2 0 0 0 .164-.546c.028-.13.306-.13.335 0a3.2 3.2 0 0 0 .163.546 4 4 0 0 0 7.636-2.106 4 4 0 0 0 .556-6.588 4 4 0 0 0-2.526-5.77A3 3 0 1 0 12 5"
        stroke={color}
      />
      <Path d="M17.599 6.5a3 3 0 0 0 .399-1.375" stroke={color} />
      <Path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" stroke={color} />
      <Path d="M3.477 10.896a4 4 0 0 1 .585-.396" stroke={color} />
      <Path d="M19.938 10.5a4 4 0 0 1 .585.396" stroke={color} />
      <Path d="M6 18a4 4 0 0 1-1.967-.516" stroke={color} />
      <Path d="M19.967 17.484A4 4 0 0 1 18 18" stroke={color} />
      <_Circle cx="12" cy="12" r="3" stroke={color} />
      <Path d="m15.7 10.4-.9.4" stroke={color} />
      <Path d="m9.2 13.2-.9.4" stroke={color} />
      <Path d="m13.6 15.7-.4-.9" stroke={color} />
      <Path d="m10.8 9.2-.4-.9" stroke={color} />
      <Path d="m15.7 13.5-.9-.4" stroke={color} />
      <Path d="m9.2 10.9-.9-.4" stroke={color} />
      <Path d="m10.5 15.7.4-.9" stroke={color} />
      <Path d="m13.1 9.2.4-.9" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'BrainCog'

export const BrainCog = memo<IconProps>(themed(Icon))
