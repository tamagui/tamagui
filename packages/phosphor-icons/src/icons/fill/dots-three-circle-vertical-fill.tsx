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
      <_Path d="M232,128A104,104,0,1,0,128,232,104.2,104.2,0,0,0,232,128ZM116,80a12,12,0,1,1,12,12A12,12,0,0,1,116,80Zm0,48a12,12,0,1,1,12,12A12,12,0,0,1,116,128Zm0,48a12,12,0,1,1,12,12A12,12,0,0,1,116,176Z" />
    </_Svg>
  )
}

Icon.displayName = 'DotsThreeCircleVerticalFill'

export const DotsThreeCircleVerticalFill = memo<IconProps>(themed(Icon))
