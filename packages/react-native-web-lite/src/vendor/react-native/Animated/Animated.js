import _objectSpread from '@babel/runtime/helpers/objectSpread2'
import { Platform } from 'react-native-web-internals'

import * as AnimatedImplementation from './AnimatedImplementation.js'
import * as AnimatedMock from './AnimatedMock.js'
import Image from './components/AnimatedImage.js'
import ScrollView from './components/AnimatedScrollView.js'
import Text from './components/AnimatedText.js'
import View from './components/AnimatedView.js'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

var Animated = Platform.isTesting ? AnimatedMock : AnimatedImplementation
export default {
  Image,
  ScrollView,
  Text,
  View,
  ...Animated.default,
}
