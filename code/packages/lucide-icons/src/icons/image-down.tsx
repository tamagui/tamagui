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

      <_Circle cx="9" cy="9" r="2" stroke={color} />
      <Path
        d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10.8"
        stroke={color} />

      <Path d="m21 15-3.1-3.1a2 2 0 0 0-2.814.014L6 21" stroke={color} />
      <Path d="m14 19.5 3 3v-6" stroke={color} />
      <Path d="m17 22.5 3-3" stroke={color} />
    </Svg>);

};

Icon.displayName = 'ImageDown';

export const ImageDown = React.memo<IconProps>(themed(Icon));