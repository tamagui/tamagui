export function generateNewAnimationId(): number;
export function shouldUseNativeDriver(config: any): any;
declare namespace _default {
    export { API };
    export { addWhitelistedStyleProp };
    export { addWhitelistedTransformProp };
    export { addWhitelistedInterpolationParam };
    export { validateStyles };
    export { validateTransform };
    export { validateInterpolation };
    export { generateNewNodeTag };
    export { generateNewAnimationId };
    export { assertNativeAnimatedModule };
    export { shouldUseNativeDriver };
    export { transformDataType };
}
export default _default;
declare namespace API {
    function getValue(tag: any, saveValueCallback: any): void;
    function setWaitingForIdentifier(id: any): void;
    function unsetWaitingForIdentifier(id: any): void;
    function disableQueue(): void;
    function queueOperation(fn: any): void;
    function createAnimatedNode(tag: any, config: any): void;
    function startListeningToAnimatedNodeValue(tag: any): void;
    function stopListeningToAnimatedNodeValue(tag: any): void;
    function connectAnimatedNodes(parentTag: any, childTag: any): void;
    function disconnectAnimatedNodes(parentTag: any, childTag: any): void;
    function startAnimatingNode(animationId: any, nodeTag: any, config: any, endCallback: any): void;
    function stopAnimation(animationId: any): void;
    function setAnimatedNodeValue(nodeTag: any, value: any): void;
    function setAnimatedNodeOffset(nodeTag: any, offset: any): void;
    function flattenAnimatedNodeOffset(nodeTag: any): void;
    function extractAnimatedNodeOffset(nodeTag: any): void;
    function connectAnimatedNodeToView(nodeTag: any, viewTag: any): void;
    function disconnectAnimatedNodeFromView(nodeTag: any, viewTag: any): void;
    function restoreDefaultValues(nodeTag: any): void;
    function dropAnimatedNode(tag: any): void;
    function addAnimatedEventToView(viewTag: any, eventName: any, eventMapping: any): void;
    function removeAnimatedEventFromView(viewTag: any, eventName: any, animatedNodeTag: any): void;
    function removeAnimatedEventFromView(viewTag: any, eventName: any, animatedNodeTag: any): void;
}
declare function addWhitelistedStyleProp(prop: any): void;
declare function addWhitelistedTransformProp(prop: any): void;
declare function addWhitelistedInterpolationParam(param: any): void;
declare function validateStyles(styles: any): void;
declare function validateTransform(configs: any): void;
declare function validateInterpolation(config: any): void;
declare function generateNewNodeTag(): number;
declare function assertNativeAnimatedModule(): void;
declare function transformDataType(value: any): any;
//# sourceMappingURL=NativeAnimatedHelper.d.ts.map