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

      <_Circle cx="5" cy="6" r="3" stroke={color} />
      <Path d="M5 9v6" stroke={color} />
      <_Circle cx="5" cy="18" r="3" stroke={color} />
      <Path d="M12 3v18" stroke={color} />
      <_Circle cx="19" cy="6" r="3" stroke={color} />
      <Path d="M16 15.7A9 9 0 0 0 19 9" stroke={color} />
    </Svg>);

};

Icon.displayName = 'GitGraph';

export const GitGraph = React.memo<IconProps>(themed(Icon));