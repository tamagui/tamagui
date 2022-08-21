/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const Platform = {
  OS: 'web',
  select: (obj: any): any => ('web' in obj ? obj.web : obj.default),
  isTesting: process.env.NODE_ENV === 'test',
}

export default Platform
