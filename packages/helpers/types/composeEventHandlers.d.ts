import type { FocusEvent } from 'react';
import type { GestureResponderEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
declare type Events = Event | GestureResponderEvent | FocusEvent | NativeSyntheticEvent<NativeScrollEvent>;
export declare type EventHandler<E extends Events> = (event: E) => void;
export declare function composeEventHandlers<E extends Events>(og?: EventHandler<E>, next?: EventHandler<E>, { checkDefaultPrevented }?: {
    checkDefaultPrevented?: boolean | undefined;
}): (event: E) => void;
export {};
//# sourceMappingURL=composeEventHandlers.d.ts.map