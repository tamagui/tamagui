import * as React from "react";
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

      <Path d="m2 2 20 20" stroke={color} />
      <Path d="M8.35 2.69A10 10 0 0 1 21.3 15.65" stroke={color} />
      <Path d="M19.08 19.08A10 10 0 1 1 4.92 4.92" stroke={color} />
    </Svg>);

};

Icon.displayName = 'CircleOff';

export const CircleOff = React.memo<IconProps>(themed(Icon));