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

      <Polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke={color} />
      <Line x1="12" x2="12" y1="22" y2="15.5" stroke={color} />
      <Polyline points="22 8.5 12 15.5 2 8.5" stroke={color} />
      <Polyline points="2 15.5 12 8.5 22 15.5" stroke={color} />
      <Line x1="12" x2="12" y1="2" y2="8.5" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Codepen';

export const Codepen = React.memo<IconProps>(themed(Icon));