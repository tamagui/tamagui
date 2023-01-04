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
      <_Path d="M200,168a48,48,0,0,1-48,48H136v16a8,8,0,0,1-16,0V216H104a48,48,0,0,1-48-48,8,8,0,0,1,16,0,32.1,32.1,0,0,0,32,32h48a32,32,0,0,0,0-64H108a48,48,0,0,1,0-96h12V24a8,8,0,0,1,16,0V40h8a48,48,0,0,1,48,48,8,8,0,0,1-16,0,32.1,32.1,0,0,0-32-32H108a32,32,0,0,0,0,64h44A48,48,0,0,1,200,168Z" />
    </_Svg>
  )
}

Icon.displayName = 'CurrencyDollarSimpleFill'

export const CurrencyDollarSimpleFill = memo<IconProps>(themed(Icon))
