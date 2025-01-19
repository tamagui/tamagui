/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
export declare const canUseDOM: boolean;
export declare const getBoundingClientRect: (node: HTMLElement | null) => void | DOMRect;
/**
 * Store the responderId on a host node
 */
export declare function setResponderId(node: any, id: any): void;
/**
 * Filter the event path to contain only the nodes attached to the responder system
 */
export declare function getResponderPaths(domEvent: any): {
    idPath: Array<number>;
    nodePath: Array<any>;
};
/**
 * Walk the paths and find the first common ancestor
 */
export declare function getLowestCommonAncestor(pathA: Array<any>, pathB: Array<any>): any;
/**
 * Determine whether any of the active touches are within the current responder.
 * This cannot rely on W3C `targetTouches`, as neither IE11 nor Safari implement it.
 */
export declare function hasTargetTouches(target: any, touches: any): boolean;
/**
 * Ignore 'selectionchange' events that don't correspond with a person's intent to
 * select text.
 */
export declare function hasValidSelection(domEvent: any): boolean;
/**
 * Events are only valid if the primary button was used without specific modifier keys.
 */
export declare function isPrimaryPointerDown(domEvent: any): boolean;
export declare function isSelectionValid(): boolean;
//# sourceMappingURL=utils.d.ts.map