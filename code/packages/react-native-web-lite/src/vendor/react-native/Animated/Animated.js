import _objectSpread from '@babel/runtime/helpers/objectSpread2'
import { Platform } from '@tamagui/react-native-web-internals'

import * as AnimatedImplementation from './AnimatedImplementation'
import * as AnimatedMock from './AnimatedMock'
import Image from './components/AnimatedImage'
import ScrollView from './components/AnimatedScrollView'
import Text from './components/AnimatedText'
import View from './components/AnimatedView'

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
