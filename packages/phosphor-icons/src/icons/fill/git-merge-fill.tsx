import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M188,104a36.1,36.1,0,0,0-35.8,32H130.5a40,40,0,0,1-30.8-14.4L82.5,100.9A35.9,35.9,0,1,0,60,103.1v49.8a36,36,0,1,0,16,0V118.1l11.5,13.7a55.4,55.4,0,0,0,43,20.2h23.6A36,36,0,1,0,188,104ZM88,188a20,20,0,1,1-20-20A20.1,20.1,0,0,1,88,188Zm100-28a20,20,0,1,1,20-20A20.1,20.1,0,0,1,188,160Z" />
    </_Svg>
  )
}

Icon.displayName = 'GitMergeFill'

export const GitMergeFill = memo<IconProps>(themed(Icon))
