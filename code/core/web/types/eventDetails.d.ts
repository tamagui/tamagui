export type TamaguiChangeReason = 'trigger-press' | 'trigger-hover' | 'trigger-focus' | 'context-menu' | 'long-press' | 'item-press' | 'item-hover' | 'sibling-open' | 'close-press' | 'backdrop-press' | 'outside-press' | 'focus-out' | 'escape-key' | 'keyboard' | 'input-change' | 'native-change' | 'list-navigation' | 'drag' | 'track-press' | 'pointer' | 'sheet-drag' | 'sheet-snap' | 'swipe' | 'timeout' | 'scroll' | 'submit' | 'image-load' | 'image-error' | 'animation-finish' | 'native-dismiss' | 'native-back' | 'adapt-morph' | 'imperative-action' | 'initial';
export type TamaguiEventDetails<Reason extends TamaguiChangeReason = TamaguiChangeReason, NativeEvent = unknown, Extra extends object = {}> = {
    reason: Reason;
    event: NativeEvent | undefined;
    trigger: unknown | undefined;
} & Extra;
export type TamaguiChangeEventDetails<Reason extends TamaguiChangeReason = TamaguiChangeReason, NativeEvent = unknown, Extra extends object = {}> = TamaguiEventDetails<Reason, NativeEvent, Extra> & {
    cancel(): void;
    readonly isCanceled: boolean;
};
export declare function createChangeEventDetails<Reason extends TamaguiChangeReason, NativeEvent = unknown, Extra extends object = {}>(reason: Reason, event?: NativeEvent, trigger?: unknown, extra?: Extra): TamaguiChangeEventDetails<Reason, NativeEvent, Extra>;
//# sourceMappingURL=eventDetails.d.ts.map