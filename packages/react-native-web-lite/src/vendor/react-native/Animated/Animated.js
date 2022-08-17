/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
import Platform from '../../../exports/Platform'
import Impl from './AnimatedImplementation'
import Mock from './AnimatedMock'
import Image from './components/AnimatedImage'
import ScrollView from './components/AnimatedScrollView'
import Text from './components/AnimatedText'
import View from './components/AnimatedView'

export default {
  Platform,
  Image,
  ScrollView,
  Text,
  View,
  ...(Platform.isTesting ? Mock : Impl),
}
