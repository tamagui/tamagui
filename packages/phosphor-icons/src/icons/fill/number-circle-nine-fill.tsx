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
      <_Path d="M148,112a20,20,0,1,1-20-20A20.1,20.1,0,0,1,148,112Zm84,16A104,104,0,1,1,128,24,104.2,104.2,0,0,1,232,128Zm-68-16a36,36,0,1,0-36,36h1.8l-16.7,27.9a8.1,8.1,0,0,0,2.8,11A8.7,8.7,0,0,0,120,188a8.1,8.1,0,0,0,6.9-3.9l32.2-54,.3-.5A36,36,0,0,0,164,112Z" />
    </_Svg>
  )
}

Icon.displayName = 'NumberCircleNineFill'

export const NumberCircleNineFill = memo<IconProps>(themed(Icon))
