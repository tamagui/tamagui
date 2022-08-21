export function attachNativeEvent(viewRef: any, eventName: any, argMapping: any): {
    detach(): void;
};
export class AnimatedEvent {
    constructor(argMapping: any, config: any);
    _listeners: any[];
    _argMapping: any;
    _callListeners(...args: any[]): void;
    _attachedEvent: {
        detach(): void;
    } | null;
    __isNative: any;
    __addListener(callback: any): void;
    __removeListener(callback: any): void;
    __attach(viewRef: any, eventName: any): void;
    __detach(viewTag: any, eventName: any): void;
    __getHandler(): (...args: any[]) => void;
}
//# sourceMappingURL=AnimatedEvent.d.ts.map