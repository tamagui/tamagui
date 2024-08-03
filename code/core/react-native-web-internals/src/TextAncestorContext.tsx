import * as React from "react"; /**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */




export const TextAncestorContext = React.createContext(false);
export default (TextAncestorContext as Context<boolean>);