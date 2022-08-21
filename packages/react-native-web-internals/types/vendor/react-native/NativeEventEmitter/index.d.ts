export default class NativeEventEmitter {
    constructor(nativeModule: any);
    _nativeModule: any;
    addListener(eventType: any, listener: any, context: any): {
        remove: () => void;
    };
    removeListener(eventType: any, listener: any): void;
    emit(eventType: any, ...args: any[]): void;
    removeAllListeners(eventType: any): void;
    listenerCount(eventType: any): number;
}
//# sourceMappingURL=index.d.ts.map