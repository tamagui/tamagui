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
      <Path d="m18 16 4-4-4-4" stroke={color} />
      <Path d="m6 8-4 4 4 4" stroke={color} />
      <Path d="m14.5 4-5 16" stroke={color} />
    </Svg>
  )
}

Icon.displayName = 'CodeXml'

export const CodeXml: NamedExoticComponent<IconProps> = memo<IconProps>(themed(Icon))
