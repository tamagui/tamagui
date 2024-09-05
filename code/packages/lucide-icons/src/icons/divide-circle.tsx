import React from "react";
import PropTypes from 'prop-types';
import type { IconProps } from '@tamagui/helpers-icon';
import {
  Svg,
  Circle as _Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text as _Text,
  Use,
  Defs,
  Stop } from
'react-native-svg';
import { themed } from '@tamagui/helpers-icon';

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props;
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
      {...otherProps}>

      <Line x1="8" x2="16" y1="12" y2="12" stroke={color} />
      <Line x1="12" x2="12" y1="16" y2="16" stroke={color} />
      <Line x1="12" x2="12" y1="8" y2="8" stroke={color} />
      <_Circle cx="12" cy="12" r="10" stroke={color} />
    </Svg>);

};

Icon.displayName = 'DivideCircle';

export const DivideCircle = React.memo<IconProps>(themed(Icon));