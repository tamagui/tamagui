import { FocusEvent } from 'react';
import { GestureResponderEvent } from 'react-native';
export declare type EventHandler<E extends Event | GestureResponderEvent | FocusEvent> = (event: E) => void;
export declare function composeEventHandlers<E extends Event | GestureResponderEvent | FocusEvent>(og?: EventHandler<E>, next?: EventHandler<E>, { checkDefaultPrevented }?: {
    checkDefaultPrevented?: boolean | undefined;
}): (event: E) => void;
//# sourceMappingURL=composeEventHandlers.d.ts.map