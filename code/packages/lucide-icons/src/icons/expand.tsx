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

      <Path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" stroke={color} />
      <Path d="M3 16.2V21m0 0h4.8M3 21l6-6" stroke={color} />
      <Path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" stroke={color} />
      <Path d="M3 7.8V3m0 0h4.8M3 3l6 6" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Expand';

export const Expand = React.memo<IconProps>(themed(Icon));