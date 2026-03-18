import React, { Context } from 'react';
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
export declare function createOptimizedView(children: any, viewProps: Record<string, any>, baseViews: {
    TextAncestor: Context<any>;
}): React.DOMElement<Record<string, any>, Element> | React.FunctionComponentElement<React.ProviderProps<any>>;
export declare function getAccessibilityRoleFromRole(role: any): "alert" | "button" | "checkbox" | "combobox" | "grid" | "header" | "image" | "link" | "list" | "menu" | "menubar" | "menuitem" | "none" | "progressbar" | "radio" | "radiogroup" | "scrollbar" | "search" | "adjustable" | "spinbutton" | "summary" | "switch" | "tab" | "tablist" | "timer" | "toolbar" | undefined;
//# sourceMappingURL=createOptimizedView.native.d.ts.map