export default AnimatedNode;
declare class AnimatedNode {
    __attach(): void;
    __detach(): void;
    __nativeTag: any;
    __getValue(): void;
    __getAnimatedValue(): void;
    __addChild(child: any): void;
    __removeChild(child: any): void;
    __getChildren(): never[];
    _listeners: {};
    __makeNative(): void;
    addListener(callback: any): string;
    removeListener(id: any): void;
    removeAllListeners(): void;
    hasListeners(): boolean;
    _startListeningToNativeValueUpdates(): void;
    __shouldUpdateListenersForNewNativeTag: boolean | undefined;
    __nativeAnimatedValueListener: any;
    _onAnimatedValueUpdateReceived(value: any): void;
    __callListeners(value: any): void;
    _stopListeningForNativeValueUpdates(): void;
    __getNativeTag(): any;
    __getNativeConfig(): void;
    toJSON(): void;
}
//# sourceMappingURL=AnimatedNode.d.ts.map