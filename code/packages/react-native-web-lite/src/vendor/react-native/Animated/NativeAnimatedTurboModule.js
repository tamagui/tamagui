/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

import * as TurboModuleRegistry from '../TurboModule/TurboModuleRegistry';

// Type definitions
export const EventMapping = {};
export const AnimatedNodeConfig = {};
export const AnimatingNodeConfig = {};
export const SaveValueCallback = () => {};
export const EndCallback = () => {};

// The config has different keys depending on the type of the Node
// TODO(T54896888): Make these types strict

const spec = {
  startOperationBatch: () => {},
  finishOperationBatch: () => {},
  createAnimatedNode: (tag, config) => {},
  getValue: (tag, saveValueCallback) => {},
  startListeningToAnimatedNodeValue: (tag) => {},
  stopListeningToAnimatedNodeValue: (tag) => {},
  connectAnimatedNodes: (parentTag, childTag) => {},
  disconnectAnimatedNodes: (parentTag, childTag) => {},
  startAnimatingNode: (
    animationId,
    nodeTag,
    config,
    endCallback,
  ) => {},
  stopAnimation: (animationId) => {},
  setAnimatedNodeValue: (nodeTag, value) => {},
  setAnimatedNodeOffset: (nodeTag, offset) => {},
  flattenAnimatedNodeOffset: (nodeTag) => {},
  extractAnimatedNodeOffset: (nodeTag) => {},
  connectAnimatedNodeToView: (nodeTag, viewTag) => {},
  disconnectAnimatedNodeFromView: (nodeTag, viewTag) => {},
  restoreDefaultValues: (nodeTag) => {},
  dropAnimatedNode: (tag) => {},
  addAnimatedEventToView: (
    viewTag,
    eventName,
    eventMapping,
  ) => {},
  removeAnimatedEventFromView: (
    viewTag,
    eventName,
    animatedNodeTag,
  ) => {},

  // Events
  addListener: (eventName) => {},
  removeListeners: (count) => {},
};

const NativeAnimatedTurboModule = TurboModuleRegistry.get('NativeAnimatedTurboModule') || spec;
export { NativeAnimatedTurboModule }
export default NativeAnimatedTurboModule;
