import { memo, type JSX } from 'react'
import { Svg, Path, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Anchor: (props: IconProps) => JSX.Element = themed(
  memo(function Anchor(props: IconProps) {
    const {
      color = 'black',
      size = 24,
      ...otherProps
    } = props as SvgProps & {
      color?: string
      size?: number
    }
    return (
      <Svg width={size} height={size} viewBox="0 0 256 256" fill={color} {...otherProps}>
        <Path d="M216,136a8,8,0,0,0-8,8c0,24.69-13.77,29.64-38.1,36.28-11.36,3.1-24.12,6.6-33.9,14.34V128h32a8,8,0,0,0,0-16H136V87a32,32,0,1,0-16,0v25H88a8,8,0,0,0,0,16h32v66.62c-9.78-7.74-22.54-11.24-33.9-14.34C61.77,173.64,48,168.69,48,144a8,8,0,0,0-16,0c0,38.11,27.67,45.66,49.9,51.72C106.23,202.36,120,207.31,120,232a8,8,0,0,0,16,0c0-24.69,13.77-29.64,38.1-36.28C196.33,189.66,224,182.11,224,144A8,8,0,0,0,216,136ZM112,56a16,16,0,1,1,16,16A16,16,0,0,1,112,56Z" />
      </Svg>
    )
  })
)
