declare type Callback = (...args: any) => void;
declare type OnOpenCallback = (event: 'onOpen', callback: (url: string) => void) => void;
declare type GenericCallback = (event: string, callback: Callback) => void;
declare class Linking {
    _eventCallbacks: {
        [key: string]: Array<Callback>;
    };
    _dispatchEvent(event: string, ...data: any): void;
    addEventListener: OnOpenCallback | GenericCallback;
    removeEventListener: OnOpenCallback | GenericCallback;
    canOpenURL(): Promise<boolean>;
    getInitialURL(): Promise<string>;
    openURL(url: string, target?: string): Promise<Object | void>;
    _validateURL(url: string): void;
}
declare const _default: Linking;
export default _default;
//# sourceMappingURL=index.d.ts.map