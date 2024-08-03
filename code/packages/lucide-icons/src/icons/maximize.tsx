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

      <Path d="M8 3H5a2 2 0 0 0-2 2v3" stroke={color} />
      <Path d="M21 8V5a2 2 0 0 0-2-2h-3" stroke={color} />
      <Path d="M3 16v3a2 2 0 0 0 2 2h3" stroke={color} />
      <Path d="M16 21h3a2 2 0 0 0 2-2v-3" stroke={color} />
    </Svg>);

};

Icon.displayName = 'Maximize';

export const Maximize = React.memo<IconProps>(themed(Icon));